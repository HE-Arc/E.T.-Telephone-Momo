from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.shortcuts import redirect
from ETMApp.models import Conversation, Game
import logging
from django.core import serializers

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


    return render(request, 'ETMApp/lobby.html', {
        'game_url': url
    })


def game(request):
    return JsonResponse({'yo': 1})
    return render(request, 'ETMApp/game.html')


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

def history_game(request, urlGame):
    conversations = Conversation.get_all_serializable(urlGame)
    print("conversation: ")
    if (len(conversations) > 0):
        return render(request, 'ETMApp/history/conversations.html', {
            'conversations': conversations,
            'game_url': urlGame
        })
    return redirect('/history')

def history_game_conversation(request, urlGame, urlConversation):
    conversations = Conversation.get_all_serializable(urlGame)
    isValid = False
    for i, c in enumerate(conversations):
        if c['urlConversation'] == urlConversation:
            index = i
            isValid = True

    if not isValid:
        return redirect('/history/' + urlGame)

    i = index
    

    next_conv = urlGame + '/' + conversations[(i - 1) % len(conversations)]['urlConversation']
    prev_conv = urlGame + '/' + conversations[(i + 1) % len(conversations)]['urlConversation']

    return render(request, 'ETMApp/history/conversation.html', {
        'conversation': conversations[i], 
        'game_url': urlGame,
        'next_conv': next_conv,
        'prev_conv': prev_conv
    })


def create_game(request):
    game = Game.create()
    game.save()
    return redirect('/play/' + game.url_game)

# TMP PAGES TODO
def conversations(request):
    return render(request, 'ETMApp/history/conversations.html')

def draw(request):
    return render(request, 'ETMApp/game/draw.html')

def find(request):
    return render(request, 'ETMApp/game/find.html')

def base_game(request):
    return render(request, 'ETMApp/base_game.html')

def watch(request):
    return render(request, 'ETMApp/game/watch.html')