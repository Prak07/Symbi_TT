from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),
    path("teachers/", views.search_teacher, name="search_teacher"),
    path("login/", views.login, name="login"),
    path("check_mail/", views.check_mail, name="check_mail"),
    path("new_pass/<token>", views.new_pass, name="new_pass"),
    path("logout/", views.logout, name="logout"),
    path("update_routine/", views.update_routine, name="update_routine"),
    path("update_teacher/", views.update_teacher, name="update_teacher"),
    path("message/", views.message, name="message"),
]
