from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.shortcuts import redirect
from django.template.loader import get_template, render_to_string
from ETMApp.models import Conversation, Game
from django.core import serializers
from easy_pdf.rendering import render_to_pdf_response
from django.shortcuts import HttpResponse


def login(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'ETMApp/login.html')


def signup(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'ETMApp/signup.html')


def try_signup(request):
    if request.user.is_authenticated:
        return JsonResponse({'error': True, 'msg': 'already_connected'})

    if request.method != 'POST':
        return JsonResponse({'error': True, 'msg': 'invalid_request'})
    
    if 'username' not in request.POST or 'password' not in request.POST:
        return JsonResponse({'error': True, 'msg': 'invalid_post'})

    username = request.POST['username']
    password = request.POST['password']

    if len(username) < 3 or len(password) < 3:
        return JsonResponse({'error': True, 'msg': 'invalid_data'})
    
    does_exist = User.objects.filter(username=username).exists()

    if does_exist:
        return JsonResponse({'error': True, 'msg': 'user_already_exist'})

    user = User.objects.create_user(username, password=password)
    # user = authenticate(username=username, password=password)
    auth_login(request, user)
    return JsonResponse({'error': False, 'msg': 'signed'})


def try_login(request):
    if request.user.is_authenticated:
        return JsonResponse({'error': True, 'msg': 'already_connected'})
    if request.method != 'POST':
        return JsonResponse({'error': True, 'msg': 'invalid_request'})
    if 'username' not in request.POST or 'password' not in request.POST:
        return JsonResponse({'error': True, 'msg': 'invalid_post'})
        
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        auth_login(request, user)
        return JsonResponse({'error': False, 'msg': 'connected'})
    return JsonResponse({'error': True, 'msg': 'invalid_credentials'})


def disconnect(request):
    logout(request)
    return redirect('/')
