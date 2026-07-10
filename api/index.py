import os
import sys
from django.core.wsgi import get_wsgi_application

# 1. Locate the 'server' directory relative to this file
current_dir = os.path.dirname(__file__)
server_path = os.path.abspath(os.path.join(current_dir, '..', 'server'))

# 2. Inject it into Python's path so Vercel can see your apps
sys.path.append(server_path)

# 3. Tell Django where your settings module lives
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# 4. Expose the WSGI application for Vercel
app = get_wsgi_application()