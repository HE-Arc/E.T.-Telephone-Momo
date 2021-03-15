from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ETMApp.models import Game
from ETMApp.models import Message
from ETMApp.models import Conversation

class GameLogic:
    def __init__(self, url):
        self.url = url
        self.players = {}
        self.has_started = False
        self.game_model = Game.objects.get(url_game=url)

        self.channel_layer = get_channel_layer()
        self.group_send = async_to_sync(self.channel_layer.group_send)

        self.conversations = []

    def add_player(self, member):
        if len(self.players) == 0:
            member.is_admin = True
        if member.id in self.players:
            member.is_admin = self.players[member.id].is_admin
        self.players[member.id] = member
        
        #self.players[member.id] = member
        self.update_player()

    def remove_player(self, member):
        #del self.players[member.id]
        
        #if member.isAdmin:
        member.is_disconnected = True
        self.update_player()

    def update_player(self):
        self.send('lobby_players', [x.__dict__ for x in self.players.values()])

    def send(self, data_type, data):
        self.group_send(self.url,
                        {'type': 'message', 'data_type': data_type, 'data': data})

    def start(self):
        if not self.has_started:
            self.has_started = True
            self.send('game_start', {})
            self.game_model.has_started = True
            self.game_model.save()
            #self.round_choose_word()
            
            i = 0
            for m in self.players:
                if not self.players[m].is_disconnected:
                    
                    conv = Conversation.create(self.game_model)
                    conv.save()
                    #conv.addRound()
                    self.conversations.append(conv)
                    self.players[m].current_conversation = i
                    i += 1
                    #rounds

    def send_round_message(self, user, text):
        #for conv in self.conversations
        conv = self.conversations[user.current_conversation]
        m = Message.create_message(conv, user.getUser(), user.is_connected, text, conv.nb_message())
        m.save()
        conv.add_message(m)


