from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ETMApp.models import Game

class GameLogic:
    def __init__(self, url):
        self.url = url
        self.players = {}
        self.has_started = False
        self.game_model = Game.objects.get(url_game=url)

        self.channel_layer = get_channel_layer()
        self.group_send = async_to_sync(self.channel_layer.group_send)

    def add_player(self, member):
        self.players[member.id] = member
        self.update_player()

    def remove_player(self, member):
        del self.players[member.id]
        self.update_player()

    def update_player(self):
        self.send('lobby_players', [x.__dict__ for x in self.players.values()])

    def send(self, data_type, data):
        self.group_send(self.url,
                        {'type': 'message', 'data_type': data_type, 'data': data})
    # TODO check if user created game
    def start(self):
        if not self.has_started:
            self.has_started = True
            self.send('game_start', {})
            self.game_model.has_started = True
            self.game_model.save()