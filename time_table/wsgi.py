import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "time_table.settings")

application = get_wsgi_application()


app = application
