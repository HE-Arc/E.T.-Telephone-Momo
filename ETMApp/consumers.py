import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from ETMApp.game.game_logic import GameLogic
from ETMApp.game.member import Member

from ETMApp.models import UserAnonyme
import requests
import random

games = {}

class ChatConsumer(WebsocketConsumer):
    def __init__(self):
        super().__init__()

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['game_url']

        user = self.scope["user"]
        self.me = None
        if not user.is_authenticated:
            # Is not connected
            if "anonID" in self.scope["session"]:
                # Already have a session
                self.me = Member(self.scope["session"]["pseudo"], self.scope["session"]["anonID"], False,
                                 self.channel_name)
            else:
                #r = requests.get('http://names.drycodes.com/1?separator=space&format=text')
                r = "anon" + str(random.randint(0, 1000))
                anon = UserAnonyme(pseudo=r)
                anon.save()
                self.scope["session"]["pseudo"] = anon.pseudo
                self.scope["session"]["anonID"] = anon.id
                self.me = Member(self.scope["session"]["pseudo"], self.scope["session"]["anonID"], False,
                                 self.channel_name)
                self.scope["session"].save()
                for attr in dir(self.scope):
                    print("obj.%s = %r" % (attr, getattr(self.scope, attr)))
        else:
            self.me = Member(user.username, user.id, True, self.channel_name)

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )


        if self.room_name not in games:
            games[self.room_name] = GameLogic(self.room_name)

        self.game = games[self.room_name]
        self.game.add_player(self.me)

        self.accept()

        self.send(text_data=json.dumps({
            'type': 'init_player',
            'data': self.me.__dict__
        }))

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
        # message = data['message']

        if data['type'] == 'changePseudo':
            self.changePseudo(data['pseudo'])
        if data['type'] == 'startGame':
            self.game.start()

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
