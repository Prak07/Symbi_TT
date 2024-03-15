from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.http import HttpResponse
from .models import *
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email


def home(request):
    return render(request, "index.html")


def about(request):
    return render(request, "about.html")


def contact(request):
    return render(request, "contact.html")


def login(request):
    if request.method == "POST":
        submit_action = request.POST.get("submit_action")
        if submit_action == "signup":
            email = request.POST["email"]
            password = request.POST["password"]
            confirm_password = request.POST["confirm_password"]
            div = request.POST["div"]
            div = div.upper()
            sem = request.POST["sem"]
            sem_s = {
                "1": "I",
                "2": "II",
                "3": "III",
                "4": "IV",
                "5": "V",
                "6": "VI",
                "7": "VII",
                "8": "VIII",
            }
            if sem in sem_s:
                sem = sem_s[sem]
            program = request.POST["program"]
            elective = request.POST["elective"]
            Honours = request.POST["honours"]
            try:
                validate_email(email)
                if div in ["A", "B", "C", "D", "E", "F", "G", "H"]:
                    if sem in sem_s.values():
                        if password == confirm_password:
                            if CustomUser.objects.filter(email=email).exists():
                                messages.info(request, "Username already taken")
                                return render(
                                    request,
                                    "login.html",
                                    {
                                        "email": email,
                                        "password": password,
                                        "confirm_password": confirm_password,
                                        "div": div,
                                        "sem": sem,
                                        "color": "red",
                                    },
                                )
                            else:
                                h_password = make_password(password)
                                if Honours == "yes":
                                    user = CustomUser.objects.create(
                                        username=email,
                                        email=email,
                                        password=h_password,
                                        div=div,
                                        sem=sem,
                                        program=program,
                                        elective=elective,
                                        honours=True,
                                    )
                                    CustomUser.save
                                    messages.success(
                                        request,
                                        "Registration done now sign in to continue",
                                    )
                                    return render(
                                        request, "login.html", {"color": "green"}
                                    )
                                else:
                                    user = CustomUser.objects.create(
                                        username=email,
                                        email=email,
                                        password=h_password,
                                        div=div,
                                        sem=sem,
                                        program=program,
                                        elective=elective,
                                        honours=False,
                                    )
                                    CustomUser.save
                                    messages.success(
                                        request,
                                        "Registration done now sign in to continue",
                                    )
                                    return render(
                                        request, "login.html", {"color": "green"}
                                    )
                        else:
                            messages.info(request, "Password dosent match")
                            return render(
                                request,
                                "login.html",
                                {
                                    "email": email,
                                    "password": password,
                                    "confirm_password": confirm_password,
                                    "div": div,
                                    "sem": sem,
                                    "color": "red",
                                },
                            )
                    else:
                        messages.info(request, "Enter right semester")
                        return render(
                            request,
                            "login.html",
                            {
                                "email": email,
                                "password": password,
                                "confirm_password": confirm_password,
                                "div": div,
                                "sem": sem,
                                "color": "red",
                            },
                        )
                else:
                    messages.info(request, "Enter right division")
                    return render(
                        request,
                        "login.html",
                        {
                            "email": email,
                            "password": password,
                            "confirm_password": confirm_password,
                            "div": div,
                            "sem": sem,
                            "color": "red",
                        },
                    )
            except:
                messages.info(request, "Enter correct e-mail")
                return render(
                    request,
                    "login.html",
                    {
                        "email": email,
                        "password": password,
                        "confirm_password": confirm_password,
                        "div": div,
                        "sem": sem,
                        "color": "red",
                    },
                )
        elif submit_action == "signin":
            email = request.POST["email"]
            password = request.POST["password"]
            try:
                user = CustomUser.objects.get(email=email)
                if user is not None:
                    if user.check_password(password):
                        auth.login(request, user)
                        return redirect("/")
                    else:
                        messages.info(request, "Invalid password")
                        return redirect("login")
                else:
                    messages.info(request, "Invalid email")
                    return redirect("login")
            except:
                messages.info(request, "Invalid credentials")
                return redirect("login")
        else:
            return render(request, "login")
    else:
        return render(request, "login.html")


def logout(request):
    auth.logout(request)
    return redirect("/")
