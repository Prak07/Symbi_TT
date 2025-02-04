from django.db import models
from django.contrib.auth.models import User, AbstractUser


class CustomUser(AbstractUser):
    div = models.CharField(max_length=10,blank=True)
    sem = models.CharField(max_length=10)
    program = models.CharField(max_length=50)
    elective = models.CharField(max_length=50)
    honours = models.BooleanField(default=False)

    def __str__(self):
        return str(self.email)


class ContactUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    message = models.CharField(max_length=500)
    
    def __str__(self):
        return str(self.email)


class ForgotPass(models.Model):
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    forgot_pass_token=models.CharField(max_length=100,blank=True,null=True)
    created_on=models.DateTimeField(auto_now_add=True)
    expiry_time=models.CharField(max_length=100,blank=True,null=True)

    def __str__(self):
        return self.user.username