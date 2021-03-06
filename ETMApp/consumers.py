import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

games = {}

class Game:
    def __init__(self, url):
        self.url = url
        self.players = {}

        self.channel_layer = get_channel_layer()
        self.group_send = async_to_sync(self.channel_layer.group_send)

    def add_player(self, player_id):
        self.players[player_id] = player_id
        self.send('lobby_players', list(self.players.values()))

    def remove_player(self, player_id):
        del self.players[player_id]
        self.send('lobby_players', list(self.players.values()))

    def send(self, data_type, data):
        self.group_send(self.url,
        {'type': 'message', 'data_type': data_type,'data':data})

class ChatConsumer(WebsocketConsumer):
    def __init__(self):
        super().__init__()

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['game_url']

        if self.room_name not in games:
            games[self.room_name] = Game(self.room_name)

        self.game = games[self.room_name]
        self.game.add_player(self.channel_name)

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )


        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name,
            self.channel_name
        )

        self.game.remove_player(self.channel_name)

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )


    def message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'type': event['data_type'],
            'data': event['data']
        }))

