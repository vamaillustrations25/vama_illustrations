from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Custom session authentication that bypasses DRF's internal CSRF validation.
    Useful for API endpoints where the frontend dev server calls the backend 
    across different origins without complex CSRF token handshakes.
    """
    def enforce_csrf(self, request):
        return  # Do not enforce CSRF
