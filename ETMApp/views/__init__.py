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

from ETMApp.views.views_history import *
from ETMApp.views.views_login import *


def index(request):
    return render(request, 'ETMApp/index.html')


def about(request):
    return render(request, 'ETMApp/about.html')


def create_game(request):
    game = Game.create()
    game.save()
    return redirect('/play/' + game.url_game)


def play(request, url):
    request.session['isWorking'] = 1  # necessary to make session work for the sockets
    game = None
    try:
        game = Game.objects.get(url_game=url)
    except:
        pass
    if game is None:
        return redirect('/')
    elif game.has_ended:
        return redirect('/history/' + url)
    elif game.has_started:
        return redirect('/')

    return render(request, 'ETMApp/game/lobby.html', {
        'game_url': url
    })


# temp page for debugging and see all parties ever created, even when not connected
# left on production on purpose
def admin_debug(request):
    games = Game.get_all_serializable_admin()

    return render(request, 'ETMApp/history/history.html', {
        'games': games
    })


# TMP PAGES TODO
def base_game(request):
    return render(request, 'ETMApp/base_game.html')
