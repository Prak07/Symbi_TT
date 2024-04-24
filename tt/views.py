from django.forms import ValidationError
from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.http import HttpResponse, JsonResponse
from .models import *
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
import requests
import asyncio
from bs4 import BeautifulSoup
from datetime import date, datetime
import json
import pytz
from asgiref.sync import sync_to_async
from django_ratelimit.decorators import ratelimit


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
            sem = sem.upper()
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
                                messages.info(request, "Email already taken")
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
                                    auth.login(request, user)
                                    return redirect("/")
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
                                    auth.login(request, user)
                                    return redirect("/")
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


def update_profile(request, page):
    if request.user.is_authenticated:
        if request.method == "POST":
            user = request.user
            div = request.POST["div"]
            email = request.POST["email"]
            div = div.upper()
            sem = request.POST["sem"]
            sem = sem.upper()
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
            if Honours == "yes":
                user.email = email
                user.sem = sem
                user.div = div
                user.program = program
                user.elective = elective
                user.honours = True
                user.save()
                messages.info(request, "Profile Updated")
            else:
                user.email = email
                user.sem = sem
                user.div = div
                user.program = program
                user.honours = False
                user.elective = elective
                user.save()
                messages.info(request, "Profile Updated")
        return render(request, page)


@sync_to_async
def get(request, year, month, day):
    data = routine(request, year, month, day)
    return {"data_list": data}


def home(request):
    client_ip = request.META.get("HTTP_X_REAL_IP")

    # Print the client's IP address
    print("Client IP Address:", client_ip)
    if request.method == "POST":
        update_profile(request, "index.html")

    async def async_home():
        today = datetime.now()
        # Specify the timezone for India
        india_timezone = pytz.timezone("Asia/Kolkata")
        # Convert the current date and time to Indian Standard Time (IST)
        today_in_india = today.astimezone(india_timezone)
        # Convert the datetime object to a string
        today = today_in_india.strftime("%Y-%m-%d %H:%M:%S %Z")
        year, month, day = today[0:10].split("-")
        data = await get(request, year, month, day)
        return render(request, "index.html", data)

    return asyncio.run(async_home())


def about(request):
    update_profile(request, "about.html")
    return render(request, "about.html")


def contact(request):
    if request.method == "POST" and "contact_form" in request.POST:
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")
        entry = ContactUser.objects.create(name=name, email=email, message=message)
        entry.save()
        messages.info(request, "Message Sent")
        return redirect("contact")
    update_profile(request, "contact.html")
    return render(request, "contact.html")


def routine(request, year, month, day):
    if request.user.is_authenticated:
        url = f"http://time-table.sicsr.ac.in/day.php?year={year}&month={month}&day={day}&area=1&room=29"
        course = request.user.program
        sem = request.user.sem
        div = request.user.div
        honours = request.user.honours
        elective = request.user.elective

        def fetch(url, path):
            r = requests.get(url)
            with open(path, "w") as f:
                f.write(r.text)

        try:
            fetch(url, "scrap.html")
            with open("scrap.html") as f:
                html_doc = f.read()
        except:
            pass

        soup = BeautifulSoup(html_doc, "html.parser")
        l = []

        def scraping(i):
            try:
                url = "http://time-table.sicsr.ac.in/" + i.get("href")
                fetch(url, "scrap2.html")
                with open("scrap2.html") as f:
                    html_doc1 = f.read()
                    soup1 = BeautifulSoup(html_doc1, "html.parser")

                    tds = soup1.find_all("td")

                    subject = tds[1].get_text()

                    room = str(tds[5].get_text().split("-")[1])

                    start = tds[7].get_text().split("-")[0]
                    time_obj = datetime.strptime(start.strip(), "%H:%M:%S")
                    start = str(time_obj.strftime("%I:%M:%S "))

                    duration = tds[9].get_text()

                    end = str(tds[11].get_text().split("-")[0])
                    time_obj = datetime.strptime(end.strip(), "%H:%M:%S")
                    end = str(time_obj.strftime("%I:%M:%S "))

                    l.append([str(subject), start, end, room])
            except Exception as e:
                print(e)

        ele = [
            "Basic Psychology",
            "Foundations of Ethics",
            "Understanding Cinema",
            "Appreciating Cinema",
            "Music in Media",
            "Introduction to Theatre",
            "Basic Sociology",
            "Creative Writing",
        ]

        def electives(elective):
            if elective == "Basic Psychology 1":
                if ele[0] in title and "1" in title:
                    scraping(i)
            elif elective == "Basic Psychology 2":
                if ele[0] in title and "2" in title:
                    scraping(i)
            elif elective == "Basic Psychology 3":
                if ele[0] in title and "3" in title:
                    scraping(i)
            elif elective == "Foundations":
                if ele[1] in title:
                    scraping(i)
            elif elective == "Understanding Cinema":
                if ele[2] in title:
                    scraping(i)
            elif elective == "Appreciating":
                if ele[3] in title:
                    scraping(i)
            elif elective == "Music":
                if ele[4] in title:
                    scraping(i)
            elif elective == "Theatre":
                if ele[5] in title:
                    scraping(i)
            elif elective == "Sociology":
                if ele[6] in title:
                    scraping(i)
            elif elective == "Creative":
                if ele[7] in title:
                    scraping(i)
            if elective == "other":
                if "Elective" in title:
                    if not any(e in title for e in ele):
                        scraping(i)

        for i in soup.find_all("a"):
            raw_title = str(i.get("title")).split()
            title = " ".join(raw_title)
            if course == "BCA":
                if "BCA" in title:
                    if f" {sem} " in title or f" {sem}-" in title:
                        if (
                            f" {div} " in title
                            or f" {div}-" in title
                            or f" {div}:" in title
                            or f".{div} " in title
                            or f".{div}-" in title
                        ):
                            scraping(i)
                        if honours == True:
                            if "Honours" in title:
                                scraping(i)
                        if "Flexi-Credit" in title:
                            scraping(i)
                        if elective != "none":
                            electives(elective)

            elif course == "BBA(IT)":
                if "BBA(IT)" in title:
                    if f" {sem} " in title or f" {sem}-" in title:
                        if (
                            f" {div} " in title
                            or f" {div}-" in title
                            or f" {div}:" in title
                            or f".{div} " in title
                            or f".{div}-" in title
                        ):
                            scraping(i)
                        if "Flexi-Credit" in title:
                            scraping(i)
                        if elective != "none":
                            electives(elective)
            elif course == "MBA(IT)":
                if "MBA(IT)" in title:
                    if f" {sem} " in title or f" {sem}-" in title:
                        if (
                            f" {div} " in title
                            or f" {div}-" in title
                            or f" {div}:" in title
                            or f" {div}." in title
                            or f".{div}" in title
                        ):
                            scraping(i)
                    if "(SPM)" in title or "(DA)" in title:
                        scraping(i)
                    if "Flexi-Credit" in title:
                        scraping(i)
                    if elective != "none":
                        electives(elective)
            elif course == "MSC(CA)":
                if "MSc(CA)" in title:
                    if f" {sem} " in title or f" {sem}-" in title:
                        scraping(i)
                    if "Flexi-Credit" in title:
                        scraping(i)
                    if elective != "none":
                        electives(elective)
            elif course == "MBA(DT)":
                if "MBA(DT)" in title:
                    if f" {sem} " in title or f" {sem}-" in title:
                        scraping(i)
                    if "Flexi-Credit" in title:

                        scraping(i)
                    if elective != "none":
                        electives(elective)

        j = 0
        data = []
        for i in l:
            try:
                if l[j][2] == l[j + 1][1] and l[j][0] == l[j + 1][0]:
                    data.append(
                        [str(l[j][0]), str(l[j][1]), str(l[j + 1][2]), str(l[j][3])]
                    )
                    j += 2
                else:
                    data.append([str(l[j][0]), l[j][1], l[j][2], l[j][3]])
                    j += 1
            except IndexError:
                try:
                    data.append([l[j][0], l[j][1], l[j][2], l[j][3]])
                    break
                except IndexError:
                    break

        if data != []:
            return data
        else:
            return []
    else:
        return "none"


def update_routine(request):
    client_ip = request.META.get("HTTP_X_REAL_IP")

    # Print the client's IP address
    print("Client IP Address:", client_ip)
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            selected_date = data.get("date")
            selected_date = selected_date[0:10].split("-")
            year = int(selected_date[0])
            month = int(selected_date[1])
            day = int(selected_date[2])
            if month == 2:
                if year % 4 == 0:
                    if day == 29:
                        day = 1
                        month += 1
                    else:
                        day += 1
                else:
                    if day == 28:
                        day = 1
                        month += 1
                    else:
                        day += 1
            elif month == 12:
                if day == 31:
                    day = 1
                    month = 1
                    year += 1
                else:
                    day += 1
            elif month % 2 != 0 or month == 8:
                if day == 31:
                    day = 1
                    month += 1
                else:
                    day += 1
            elif month % 2 == 0:
                if day == 30:
                    day = 1
                    month += 1
                else:

                    day += 1

            async def async_home():
                data = await get(request, year, month, day)
                return JsonResponse(data)

            return asyncio.run(async_home())
    else:
        return render(request, "login.html")


def routine_teacher(request, year, month, day, teacher):
    url = f"http://time-table.sicsr.ac.in/day.php?year={year}&month={month}&day={day}&area=1&room=29"

    def fetch(url, path):
        r = requests.get(url)
        with open(path, "w") as f:
            f.write(r.text)

    try:
        fetch(url, "scrap.html")
        with open("scrap.html") as f:
            html_doc = f.read()
    except:
        pass

    soup = BeautifulSoup(html_doc, "html.parser")
    l = []

    def teacher_scraping(i):
        try:
            url = "http://time-table.sicsr.ac.in/" + i.get("href")
            fetch(url, "scrap2.html")
            with open("scrap2.html") as f:
                html_doc1 = f.read()
                soup1 = BeautifulSoup(html_doc1, "html.parser")

                tds = soup1.find_all("td")

                subject = tds[1].get_text()

                room = str(tds[5].get_text().split("-")[1])

                start = tds[7].get_text().split("-")[0]
                time_obj = datetime.strptime(start.strip(), "%H:%M:%S")
                start = str(time_obj.strftime("%I:%M:%S "))

                end = str(tds[11].get_text().split("-")[0])
                time_obj = datetime.strptime(end.strip(), "%H:%M:%S")
                end = str(time_obj.strftime("%I:%M:%S "))

                l.append([str(subject), start, end, room])
        except Exception as e:
            print(e)

    for i in soup.find_all("a"):
        raw_title = str(i.get("title")).split()
        title = " ".join(raw_title)
        t_names = [
        "Jatinderkumar Saini",
        "Parag Kaveri",
        "Sarika Sharma",
        "Rajashree Jain",
        "Rajesh Dhanraj",
        "Shirish Joshi",
        "Shraddha Vaidya",
        "Shilpa Mujumdar",
        "Shubhashri Waghmare",
        "Priti Kulkarni",
        "Sachin Naik",
        "Shrikant Mapari",
        "Gaurav Pant",
        "Shashshank Gaikwad",
        "Prafulla Bafna",
        "Anuja Bokhare",
        "Hema Gaikwad",
        "Kumari Deepika",
        "Amol Vibhute",
        "Sandeep Gaikwad",
        "Prathamesh Lahande",
        "Pattar Gurunath",
        "Chaitanya Kulkarni",
        "Shashikant Nehul",
        "Sonal Parmar",
        "Kanchangauri Joshi",
        "Rajesh Math",
        "Rohan Pramod Bhase",
        "Anirudha Ketkar",
        "Vijay Haldavnekar",
        "Satyajit Achyut Wale",
        "Janhavi Pednekar",
        "Sarika Zambad",
        "Joshi Ambadas",
        "Vaishali Joshi",
        "Kirti Mehare",
        "Gauri Madan",
        "Shashank Gaikwad",
        "Kunal Chandak",
        "Renuka Vaidya",
        "Siddharth Subramaniam",
        "Vatsala Gupta",
        "Surbhi Pai",
        "Sagar Bedre",
        "Sneha Shirlokar",
        "Sulaxan Jadhav",
        "Mrinmayi Huprikar",
        "Ramandeep Kaur",
        "Vaishali Kale",
        "Umesh Patwari",
        "Gopal Phadke",
        "Ashwini Shende",
        "Parag Joshi",
        "Nandkumar Khachane",
        "Trupti Adke",
        "Ketki Hasbnis",
        "Ketki Deshpande ",
        "Biswajit Mohpatra",
        "Manjusha Joshi",
        "Manjusha Kalgaonkar",
        "Atul Kahate",
        "Rasila Walhekar",
        "Pranita Dube",
        ]
        if " " in teacher:
            if any(teacher.lower() in name.lower() for name in t_names):
                if teacher.lower() in title.lower():
                    teacher_scraping(i)
        else:
            if any(teacher.lower() in name.lower().split() for name in t_names):
                if teacher.lower() in title.lower():
                    teacher_scraping(i)
    j = 0
    data = []
    for k in l:
        try:
            if l[j][2] == l[j + 1][1] and l[j][0] == l[j + 1][0]:
                data.append(
                    [str(l[j][0]), str(l[j][1]), str(l[j + 1][2]), str(l[j][3])]
                )
                j += 2
            else:
                data.append([str(l[j][0]), l[j][1], l[j][2], l[j][3]])
                j += 1
        except IndexError:
            try:
                data.append([l[j][0], l[j][1], l[j][2], l[j][3]])
                break
            except IndexError:
                break

    if data != []:
        return data
    else:
        return []


@sync_to_async
def get_teacher(request, year, month, day, teacher):
    data = routine_teacher(request, year, month, day, teacher)
    if data == []:
        return {"data_list": data, "message": "NO LECTURES TODAY"}
    else:
        return {"data_list": data}


def update_teacher(request):
    client_ip = request.META.get("HTTP_X_REAL_IP")
    # Print the client's IP address
    print("Client IP Address:", client_ip)
    if request.method == "POST":
        data = json.loads(request.body)
        selected_date = data.get("date")
        selected_teacher = data.get("teacher")
        selected_date = selected_date[0:10].split("-")
        year = int(selected_date[0])
        month = int(selected_date[1])
        day = int(selected_date[2])
        if month == 2:
            if year % 4 == 0:
                if day == 29:
                    day = 1
                    month += 1
                else:
                    day += 1
            else:
                if day == 28:
                    day = 1
                    month += 1
                else:
                    day += 1
        elif month == 12:
            if day == 31:
                day = 1
                month = 1
                year += 1
            else:
                day += 1
        elif month % 2 != 0 or month == 8:
            if day == 31:
                day = 1
                month += 1
            else:
                day += 1
        elif month % 2 == 0:
            if day == 30:
                day = 1
                month += 1
            else:

                day += 1

        async def async_teacher():
            data = await get_teacher(request, year, month, day, selected_teacher)
            return JsonResponse(data)

        return asyncio.run(async_teacher())


def search_teacher(request):
    if request.method == "POST" and "teacher" in request.POST:
        teacher = request.POST["teacher"]

        async def async_teacher():
            today = datetime.now()
            # Specify the timezone for India
            india_timezone = pytz.timezone("Asia/Kolkata")
            # Convert the current date and time to Indian Standard Time (IST)
            today_in_india = today.astimezone(india_timezone)
            # Convert the datetime object to a string
            today = today_in_india.strftime("%Y-%m-%d %H:%M:%S %Z")
            year, month, day = today[0:10].split("-")
            data = await get_teacher(request, year, month, day, teacher)
            data["teacher"] = teacher
            return render(request, "teachers.html", data)

        return asyncio.run(async_teacher())
    return render(request, "teachers.html")


def error_404(request, exception):
    return render(request, "404.html")
