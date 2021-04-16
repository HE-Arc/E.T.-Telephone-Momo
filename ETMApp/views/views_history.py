from django.shortcuts import render
from django.shortcuts import redirect
from ETMApp.models import Conversation, Game
from easy_pdf.rendering import render_to_pdf_response


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

    if len(conversations) > 0:
        return render(request, 'ETMApp/history/conversations.html', {
            'conversations': conversations,
            'game': game,
            'game_url': url_game
        })
    return redirect('/history')


def view_game(request, url_game):
    """ pdf of the game """
    conversations = Conversation.get_all_serializable(url_game)
    return render_to_pdf_response(request, 'ETMApp/view/render.html', {
        'conversations': conversations,
        'game_url': url_game,
    })


def history_game_conversation(request, url_game, url_conversation):
    conversations = Conversation.get_all_serializable(url_game)
    is_valid = False
    index = 0
    for i, c in enumerate(conversations):
        if c['urlConversation'] == url_conversation:
            index = i
            is_valid = True

    if not is_valid:
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


# temp page for debugging and see all parties ever created, even when not connected
# left on production on purpose
def admin_debug(request):
    games = Game.get_all_serializable_admin()

    return render(request, 'ETMApp/history/history.html', {
        'games': games,
        'debug': True
    })
