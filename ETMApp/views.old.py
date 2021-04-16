from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.shortcuts import redirect
from django.template.loader import get_template, render_to_string
from ETMApp.models import Conversation, Game
import logging
from django.core import serializers
from easy_pdf.rendering import render_to_pdf_response
from django.shortcuts import HttpResponse



def index(request):
    return render(request, 'ETMApp/index.html') 
def about(request):
    return render(request, 'ETMApp/about.html') 


def login(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'ETMApp/login.html')


def signup(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'ETMApp/signup.html')


def lobby(request, url):
    request.session['isWorking'] = 1  # necessary to make session work for the sockets
    game = None
    try:
        game = Game.objects.get(url_game=url)
    except:
        pass
    if game is None:
        return redirect('/')
    elif game.has_ended:
        return redirect('/history/'+url)
    elif game.has_started:
        return redirect('/')


    return render(request, 'ETMApp/game/lobby.html', {
        'game_url': url
    })


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
    
    doesExist = User.objects.filter(username=username).exists()

    if doesExist:
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

def history(request):
    
    id_user = request.user.id
    games = []
    if id_user is not None:
        games = Game.get_all_serializable(id_user)



    return render(request, 'ETMApp/history/history.html', {
        'games': games
    })

def history_game(request, url_game):
    conversations = Conversation.get_all_serializable(url_game)
    game = Game.objects.get(url_game=url_game).get_serializable()

    if (len(conversations) > 0):
        return render(request, 'ETMApp/history/conversations.html', {
            'conversations': conversations,
            'game': game,
            'game_url': url_game
        })
    return redirect('/history')

def view_game(request, url_game):
    """ pdf of the game """
    conversations = Conversation.get_all_serializable(url_game)
    isValid = False
    

    return render_to_pdf_response(request, 'ETMApp/view/render.html', {
            'conversations': conversations, 
            'gameUrl': url_game,
        })

def history_game_conversation(request, url_game, url_conversation):
    conversations = Conversation.get_all_serializable(url_game)
    isValid = False
    for i, c in enumerate(conversations):
        if c['urlConversation'] == url_conversation:
            index = i
            isValid = True

    if not isValid:
        return redirect('/history/' + url_game)

    i = index
    

    next_conv = url_game + '/' + conversations[(i - 1) % len(conversations)]['urlConversation']
    prev_conv = url_game + '/' + conversations[(i + 1) % len(conversations)]['urlConversation']

    return render(request, 'ETMApp/history/conversation.html', {
        'conversation': conversations[i], 
        'game_url': url_game,
        'next_conv': next_conv,
        'prev_conv': prev_conv
    })


def create_game(request):
    game = Game.create()
    game.save()
    return redirect('/play/' + game.url_game)


#temp page for debugging and see all parties ever created, even when not connected
#left on production on purpose
def admin_debug(request):
    games = Game.get_all_serializable_admin()

    return render(request, 'ETMApp/history/history.html', {
        'games': games
    })

# TMP PAGES TODO
def base_game(request):
    return render(request, 'ETMApp/base_game.html')
