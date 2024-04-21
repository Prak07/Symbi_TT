from django.http import HttpResponseForbidden

class IPBlockMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # List of banned IP addresses
        banned_ips = ['1.2.3.4', '5.6.7.8']  # Add IP addresses to block here

        # Get client's IP address from request
        client_ip = request.META.get('REMOTE_ADDR')

        # Check if client's IP is banned
        if client_ip in banned_ips:
            return HttpResponseForbidden("Access Denied")

        # Pass the request to the next middleware or view
        return self.get_response(request)