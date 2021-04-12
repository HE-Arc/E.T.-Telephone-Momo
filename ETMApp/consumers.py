import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from ETMApp.game.game_logic import GameLogic
from ETMApp.game.member import Member

from ETMApp.models import UserAnonyme
from ETMApp.models import Message
from ETMApp.models import Conversation
import requests
import random
import logging
import os
import shutil
from ETM import settings


games = {}
logger = logging.getLogger(__name__)


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
                                 self.channel_name, self)
            else:
                r = requests.get('http://names.drycodes.com/1?separator=space&format=text').text
                if len(r) >= 50:
                    r = "anon" + str(random.randint(0, 1000))
                anon = UserAnonyme(username=r)
                anon.save()
                self.scope["session"]["pseudo"] = anon.username
                self.scope["session"]["anonID"] = anon.id
                self.me = Member(self.scope["session"]["pseudo"], self.scope["session"]["anonID"], False,
                                 self.channel_name, self)
                self.scope["session"].save()
                # for attr in dir(self.scope):
                #    print("obj.%s = %r" % (attr, getattr(self.scope, attr)))
        else:
            self.me = Member(user.username, user.id, True, self.channel_name, self)

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

        if self.room_name not in games:
            games[self.room_name] = GameLogic(self.room_name, self.remove_game)

        self.game = games[self.room_name]
        self.game.add_player(self.me)

        self.accept()

        self.send(text_data=json.dumps({
            'type': 'init_player',
            'data': self.me.get_serializable()
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
        message = json.loads(text_data)
        # message = data['message']
        #print(message)
        if message['type'] == 'changePseudo':
            self.change_pseudo(message['data'])
        elif message['type'] == 'startGame':
            if self.me.is_admin:
                self.game.start(int(message['data']['nbRound']), int(message['data']['roundLength']))
        elif message['type'] == 'message':
            self.game.send_round_message(self.me, message['data'])
        elif message['type'] == 'image':
            self.game.send_round_image(self.me, message['data'])

    def change_pseudo(self, pseudo):
        if 'anonID' in self.scope['session']:
            self.me.pseudo = pseudo
            self.game.update_player()
            self.scope['session']['pseudo'] = pseudo
            self.scope['session'].save()
            anon = UserAnonyme.objects.get(id=self.scope['session']['anonID'])
            anon.username = pseudo
            anon.save()

    def message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'type': event['data_type'],
            'data': event['data']
        }))

    def remove_game(self, id):
        print("remove game " + id)
        image_base = str(settings.MEDIA_ROOT) + "/"
        image_folder = "ETMApp/games/" + id + "/"
        try:
            shutil.rmtree(image_base + image_folder)
        except OSError as e:
            print("error")
            print(e)
        del games[id]

