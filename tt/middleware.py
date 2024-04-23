# from django.http import HttpResponseForbidden
# from collections import defaultdict
# from django.utils import timezone

# class RequestTrackingMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
#         self.request_count = defaultdict(int)
#         self.last_reset_time = timezone.now()

#     def __call__(self, request):
#         # Reset request count if a minute has passed since the last reset
#         if timezone.now() - self.last_reset_time >= timezone.timedelta(minutes=1):
#             self.request_count.clear()
#             self.last_reset_time = timezone.now()

#         # Get client's IP address from request
#         client_ip = request.META.get('HTTP_X_REAL_IP')

#         # Update request count for the IP address
#         self.request_count[client_ip] += 1
#         banned_ips = ['182.65.149.16','34.172.73.212']
#         # Check if the request count exceeds a threshold
#         if client_ip in banned_ips:
#                 return HttpResponseForbidden("Access Denied")
#         max_requests_per_minute = 30  # Adjust as needed
#         if self.request_count[client_ip] > max_requests_per_minute:
#             banned_ips.append(client_ip)
#             return HttpResponseForbidden("Too many requests from your IP address.")
#         response = self.get_response(request)
#         return response
# class IPBlockMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         # List of banned IP addresses
#         banned_ips = ['182.65.149.16','34.172.73.212']  # Add IP addresses to block here
#         banned_ip_prefixes = ['154.6','38.162','34.172']  # Add IP prefixes to block here
#         # Get client's IP address from request
#         client_ip = request.META.get('HTTP_X_REAL_IP')
#         # Check if client's IP matches any banned IP prefix
#         for prefix in banned_ip_prefixes:
#             if client_ip.startswith(prefix):
#                 return HttpResponseForbidden("Access Denied")
#         # Check if client's IP is banned
#             if client_ip in banned_ips:
#                 return HttpResponseForbidden("Access Denied")

#         # Pass the request to the next middleware or view
#         return self.get_response(request)
