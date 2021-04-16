from django.shortcuts import render
from django.shortcuts import redirect
from ETMApp.models import Conversation, Game



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


def error404(request, exception=None):
    return render(request, 'ETMApp/404.html')



# TMP PAGES TODO
def base_game(request):
    return render(request, 'ETMApp/base_game.html')
