from django.urls import path
from .views import (
    GalleryListView, GalleryDetailView, ContactEnquiryView, HealthCheckView,
    AuthLoginView, AuthLogoutView, AuthCheckView, SendEmailView,
    RenderWhatsAppTemplateView
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("galleries/", GalleryListView.as_view(), name="gallery-list"),
    path("galleries/<int:pk>/", GalleryDetailView.as_view(), name="gallery-detail"),
    path("contact/", ContactEnquiryView.as_view(), name="contact-enquiry"),
    path("auth/login/", AuthLoginView.as_view(), name="auth-login"),
    path("auth/logout/", AuthLogoutView.as_view(), name="auth-logout"),
    path("auth/check/", AuthCheckView.as_view(), name="auth-check"),
    path("send-email/", SendEmailView.as_view(), name="send-email"),
    path("whatsapp-template/", RenderWhatsAppTemplateView.as_view(), name="whatsapp-template"),
]
