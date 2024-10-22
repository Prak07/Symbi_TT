from django.http import HttpResponseForbidden
from collections import defaultdict
from django.utils import timezone

class RequestTrackingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.request_count = defaultdict(int)
        self.last_reset_time = timezone.now()

    def __call__(self, request):
        # Reset request count if a minute has passed since the last reset
        if timezone.now() - self.last_reset_time >= timezone.timedelta(minutes=1):
            self.request_count.clear()
            self.last_reset_time = timezone.now()

        # Get client's IP address from request
        client_ip = request.META.get('HTTP_X_REAL_IP')

        # Update request count for the IP address
        self.request_count[client_ip] += 1
        max_requests_per_minute = 100  # Adjust as needed
        if self.request_count[client_ip] > max_requests_per_minute:
            return HttpResponseForbidden("Too many requests from your IP address.")
        response = self.get_response(request)
        return response

