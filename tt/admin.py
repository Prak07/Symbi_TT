from django.contrib import admin
from .models import *


class CostomUserAdmin(admin.ModelAdmin):
    search_fields=['email',]
class ContactUserAdmin(admin.ModelAdmin):
    search_fields=['email',]
class ForgotPassAdmin(admin.ModelAdmin):
    search_fields=['username',]

admin.site.register(CustomUser,CostomUserAdmin)
admin.site.register(ContactUser,ContactUserAdmin)
admin.site.register(ForgotPass,ForgotPassAdmin)
