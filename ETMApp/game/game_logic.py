from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from ETMApp.models import Game
from ETMApp.models import Message
from ETMApp.models import Conversation

from threading import Timer

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
        self.send('lobby_players', [x.get_serializable() for x in self.players.values()])

    def send(self, data_type, data):
        self.group_send(self.url,
                        {'type': 'message', 'data_type': data_type, 'data': data})

    def start(self):
        if not self.has_started:
            self.timer = Timer(10, self.round_end)
            self.timer.start()
            self.has_started = True
            self.send('game_start', {})
            self.game_model.has_started = True
            self.game_model.save()
            #self.round_choose_word()
            
            # Remove disconnected players
            self.players = {p.id: p for p in self.players if not p.is_disconnected}

            nbPlayer = len(self.players)
            randNumbers = [i for i in range(nbPlayer)]
            random.shuffle(randNumbers)
            

            for m in self.players:
                self.players[m].index = randNumbers.pop()
                self.players[m].is_ready = False
                conv = Conversation.create(self.game_model)
                conv.save()
                #conv.addRound()
                self.conversations.append(conv)
                self.players[m].current_conversation = self.players[m].index
                #rounds

    def send_round_message(self, user, text):
        conv = self.conversations[user.current_conversation]
        m = Message.create_message(conv, user.getUser(), user.is_connected, text, conv.nb_message())
        m.save()
        conv.add_message(m)
        user.is_ready = True
        if self.all_players_ready():
            self.timer.cancel()
            next_round()
        
    def all_players_ready(self):
        all_ready = True
        for m in self.players:
                if not self.players[m].is_disconnected:
                    if not user.is_ready:
                        all_ready = False
        return all_ready


    def round_end(self):
        print("round end called")
        self.send('round_end', None)

    def next_round(self):
        print("next round")

        # todo conversations[index + currentRound] ou
        # un truc comme ca et envoyé le text a l'utilisateur
        # tester le code qu'on a fait a la ligne 57

    
        
        

        


