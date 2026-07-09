import sys
import os

# Add the 'server' directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()
