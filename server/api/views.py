from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from .authentication import CsrfExemptSessionAuthentication
from .models import Gallery, ContactEnquiry
from .serializers import GallerySerializer, ContactEnquirySerializer


class GalleryListView(APIView):
    """
    GET  /api/galleries/        — List all galleries (optionally filter by ?featured=true)
    POST /api/galleries/        — Create a new gallery entry
    """
    authentication_classes = [CsrfExemptSessionAuthentication]

    def get(self, request):
        galleries = Gallery.objects.all()

        # Optional filter: /api/galleries/?featured=true
        featured = request.query_params.get("featured")
        if featured == "true":
            galleries = galleries.filter(is_featured=True)

        # Optional filter: /api/galleries/?tag=photography
        tag = request.query_params.get("tag")
        if tag:
            galleries = galleries.filter(tag=tag)

        serializer = GallerySerializer(galleries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GallerySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GalleryDetailView(APIView):
    """
    GET    /api/galleries/<id>/  — Retrieve a single gallery
    PUT    /api/galleries/<id>/  — Full update
    PATCH  /api/galleries/<id>/  — Partial update
    DELETE /api/galleries/<id>/  — Delete
    """
    authentication_classes = [CsrfExemptSessionAuthentication]

    def _get_object(self, pk):
        try:
            return Gallery.objects.get(pk=pk)
        except Gallery.DoesNotExist:
            return None

    def get(self, request, pk):
        gallery = self._get_object(pk)
        if gallery is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = GallerySerializer(gallery)
        return Response(serializer.data)

    def patch(self, request, pk):
        gallery = self._get_object(pk)
        if gallery is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = GallerySerializer(gallery, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        gallery = self._get_object(pk)
        if gallery is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        gallery.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework.throttling import AnonRateThrottle

class ContactSubmissionThrottle(AnonRateThrottle):
    rate = '5/hour'

class ContactEnquiryView(APIView):
    """
    POST /api/contact/   — Submit a new enquiry (public, from the Contact form)
    GET  /api/contact/   — List all enquiries (for admin use)
    """
    authentication_classes = [CsrfExemptSessionAuthentication]
    throttle_classes = [ContactSubmissionThrottle]

    def post(self, request):
        serializer = ContactEnquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Your enquiry has been received. We'll be in touch soon!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Filter by status: /api/contact/?status=new
        enquiry_status = request.query_params.get("status")
        enquiries = ContactEnquiry.objects.all()
        if enquiry_status:
            enquiries = enquiries.filter(status=enquiry_status)
        serializer = ContactEnquirySerializer(enquiries, many=True)
        return Response(serializer.data)


class HealthCheckView(APIView):
    """
    GET /api/health/  — Simple liveness probe.
    """

    def get(self, request):
        return Response({"status": "ok", "service": "vama-illustration-api"})


@method_decorator(csrf_exempt, name='dispatch')
class AuthLoginView(APIView):
    """
    POST /api/auth/login/ - Authenticate admin users
    """
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user is not None and user.is_superuser:
            login(request, user)
            return Response({"detail": "Successfully logged in", "username": user.username})
        
        return Response({"detail": "Invalid credentials or unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class AuthLogoutView(APIView):
    """
    POST /api/auth/logout/ - Logout admin users
    """
    authentication_classes = []

    def post(self, request):
        logout(request)
        return Response({"detail": "Successfully logged out"})


@method_decorator(csrf_exempt, name='dispatch')
class AuthCheckView(APIView):
    """
    GET /api/auth/check/ - Check if current session is authenticated
    """
    def get(self, request):
        if request.user.is_authenticated and request.user.is_superuser:
            return Response({"is_authenticated": True, "username": request.user.username})
        return Response({"is_authenticated": False})


@method_decorator(csrf_exempt, name='dispatch')
class SendEmailView(APIView):
    """
    POST /api/send-email/ - Send an email to an enquirer
    """
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        if not (request.user.is_authenticated and request.user.is_superuser):
            return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            
        data = request.data
        name = data.get('name')
        email = data.get('email')
        services_required = data.get('services_required', '')
        
        if not name or not email:
            return Response({"detail": "Name and email are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        subject = "Re: Your Enquiry – Vama Illustrations"
        message_body = f"Thank you for reaching out to Vama Illustrations. We have received your enquiry{' about ' + services_required if services_required else ''} and will get back to you shortly."
        
        context = {
            'name': name,
            'message_body': message_body,
        }
        
        html_message = render_to_string('emails/mailing_template.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send(fail_silently=False)
            return Response({"detail": "Email sent successfully"})
        except Exception as e:
            return Response({"detail": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class RenderWhatsAppTemplateView(APIView):
    """
    POST /api/whatsapp-template/ - Render the whatsapp template
    """
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        if not (request.user.is_authenticated and request.user.is_superuser):
            return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            
        data = request.data
        name = data.get('name', '')
        services_required = data.get('services_required', '')
        
        context = {
            'name': name,
            'services_required': services_required,
        }
        
        try:
            rendered = render_to_string('whatsapp_template.txt', context)
            return Response({"template": rendered})
        except Exception as e:
            return Response({"detail": f"Failed to render template: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

