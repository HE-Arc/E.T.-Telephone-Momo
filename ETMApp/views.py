from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.shortcuts import redirect
from ETMApp.models import Game
import logging

logger = logging.getLogger(__name__)


def index(request):
    return render(request, 'ETMApp/index.html')


def login(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'ETMApp/login.html')


def signup(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'ETMApp/signup.html')


def lobby(request, url):

    logger.error("test lobbby")
    request.session['isWorking'] = 1  # necessary to make session work

    game = Game.objects.get(url_game=url)
    if game is None or game.has_started:
        return redirect('/')
    elif game.has_ended:
        return redirect('/history/url')

    return render(request, 'ETMApp/lobby.html', {
        'game_url': url
    })


def game(request):
    return JsonResponse({'yo': 1})
    return render(request, 'ETMApp/game.html')


def try_signup(request):
    if request.user.is_authenticated:
        return JsonResponse({'error': True, 'msg': 'already_connected'})
    if request.method == 'POST':
        if 'username' in request.POST and 'password' in request.POST:
            username = request.POST['username']
            password = request.POST['password']
            if len(username) >= 3 and len(password) >= 3:
                doesExist = User.objects.filter(username=username).exists()
                if not doesExist:
                    user = User.objects.create_user(username, password=password)
                    # user = authenticate(username=username, password=password)
                    auth_login(request, user)
                    return JsonResponse({'error': False, 'msg': 'signed'})
                else:
                    return JsonResponse({'error': True, 'msg': 'user_already_exist'})
            else:
                return JsonResponse({'error': True, 'msg': 'invalid_data'})
        else:
            return JsonResponse({'error': True, 'msg': 'invalid_post'})
    else:
        return JsonResponse({'error': True, 'msg': 'invalid_request'})


def try_login(request):
    if request.user.is_authenticated:
        return JsonResponse({'error': True, 'msg': 'already_connected'})
    if request.method == 'POST':
        if 'username' in request.POST and 'password' in request.POST:
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return JsonResponse({'error': False, 'msg': 'connected'})
            else:
                return JsonResponse({'error': True, 'msg': 'invalid_credentials'})
        else:
            return JsonResponse({'error': True, 'msg': 'invalid_post'})
    else:
        return JsonResponse({'error': True, 'msg': 'invalid_request'})


def disconnect(request):
    logout(request)
    return redirect('/')


def create_game(request):
    game = Game.create()
    game.save()
    return redirect('/play/' + game.url_game)
