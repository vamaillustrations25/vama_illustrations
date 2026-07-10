import os
import sys
from django.core.wsgi import get_wsgi_application

# Locate the 'server' directory relative to this file
current_dir = os.path.dirname(__file__)
server_path = os.path.abspath(os.path.join(current_dir, '..', 'server'))

# Inject server path into Python's environment path list
if server_path not in sys.path:
    sys.path.append(server_path)

# Point to your Django core settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Expose WSGI application handler for Vercel
app = get_wsgi_application()