import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from ETMApp.models import UserAnonyme
import requests

games = {}

class Game:
    def __init__(self, url):
        self.url = url
        self.players = {}

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
        {'type': 'message', 'data_type': data_type,'data':data})

class Member:
    def __init__(self, pseudo, id, is_connected, channel_name):
        self.pseudo = pseudo
        self.id = id
        self.isConnected = is_connected
        self.channel_name = channel_name

class ChatConsumer(WebsocketConsumer):
    def __init__(self):
        super().__init__()

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['game_url']

        user = self.scope["user"]
        self.me = None
        print(self.scope['session']['test'])
        if not user.is_authenticated:
            print("user not connected")
            #TODO

            if "anonID" in self.scope["session"]:
                # Already have a session
                self.me = Member(self.scope["session"]["pseudo"], self.scope["session"]["anonID"], False, self.channel_name)
            else:
                r = requests.get('http://names.drycodes.com/1?separator=space&format=text')
                print(r.text)
                anon = UserAnonyme(pseudo=r.text)
                anon.save()
                self.scope["session"]["pseudo"] = anon.pseudo
                self.scope["session"]["anonID"] = anon.id
                self.me = Member(self.scope["session"]["pseudo"], self.scope["session"]["anonID"], False, self.channel_name)
                self.scope["session"].save()
                print(self.scope["session"]["anonID"])
                print(self.scope)
                for attr in dir(self.scope):
                    print("obj.%s = %r" % (attr, getattr(self.scope, attr)))

        else:
            print("user connected")
            print(user)
            print(user.username)
            print(user.id)
            self.me = Member(user.username, user.id, True, self.channel_name)


        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

        # TODO check if game exist
        if self.room_name not in games:
            games[self.room_name] = Game(self.room_name)

        self.game = games[self.room_name]
        self.game.add_player(self.me)




        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name,
            self.channel_name
        )

        self.game.remove_player(self.me)

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        #message = data['message']

        if data['type'] == 'changePseudo':
            self.changePseudo(data['pseudo'])
        # Send message to room group
        """async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )"""

    def changePseudo(self, pseudo):
        if 'anonID' in self.scope['session']:
            self.me.pseudo = pseudo
            self.game.update_player()
            self.scope['session']['pseudo'] = pseudo
            self.scope['session'].save()
            anon = UserAnonyme.objects.get(id=self.scope['session']['anonID'])
            anon.pseudo = pseudo
            anon.save()


    def message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'type': event['data_type'],
            'data': event['data']
        }))

