import random
import json

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from ETMApp.models import Game
from ETMApp.models import Message
from ETMApp.models import Conversation
from ETM import settings


from threading import Timer
import base64
import os



class GameLogic:
    def __init__(self, url, remove_from_dict):
        print("=====================")
        print("http://localhost:8000/play/" + url)
        print("=====================")
        self.url = url
        self.players = {}
        self.has_started = False
        self.game_model = Game.objects.get(url_game=url)

        self.channel_layer = get_channel_layer()
        self.group_send = async_to_sync(self.channel_layer.group_send)
        self.current_round = 0

        self.conversations = []
        self.all_messages = []

        self.remove_from_dict = remove_from_dict

    def add_player(self, member):
        if len(self.players) == 0:
            member.is_admin = True
        if member.id in self.players:
            member.is_admin = self.players[member.id].is_admin
        self.players[member.id] = member

        # self.players[member.id] = member
        self.update_player()

    def remove_player(self, member):
        # del self.players[member.id]

        # if member.isAdmin:
        member.is_disconnected = True

        self.update_player()

        # if all players are out, delete the party
        if self.all_players_disconnected():
            print('All players left - deleting game')
            self.remove_from_dict(self.url)
            self.game_model.delete()

    def update_player(self):
        self.send('lobby_players', [x.get_serializable() for x in self.players.values()])

    def send(self, data_type, data):
        self.group_send(self.url,
                        {'type': 'message', 'data_type': data_type, 'data': data})

    def start(self, nb_round, timer_time):
        if not self.has_started and nb_round <= len(self.players) and nb_round >= 3 and nb_round % 2 == 1:
            self.nb_round = nb_round
            self.timer_time = timer_time
            # self.timer_time = 5
            self.timer = Timer(self.timer_time, self.round_end)
            self.timer.start()
            self.has_started = True
            self.send('game_start', {'time': self.timer_time})
            self.game_model.has_started = True
            self.game_model.save()
            # self.round_choose_word()

            # Remove disconnected players
            self.players = {p.id: p for p in self.players.values() if not p.is_disconnected}

            nbPlayer = len(self.players)
            randNumbers = [i for i in range(nbPlayer)]
            random.shuffle(randNumbers)

            for m in self.players:
                self.players[m].index = randNumbers.pop()
                self.players[m].is_ready = False
                conv = Conversation.create(self.game_model)
                conv.save()
                # conv.addRound()
                self.conversations.append(conv)
                self.all_messages.append([])
                self.players[m].current_conversation = self.players[m].index
                # rounds

    def send_round_message(self, user, text):
        conv = self.conversations[user.current_conversation]
        m = Message.create_message(conv, user.getUser(), user.is_connected, text, len(self.all_messages[user.current_conversation]))
        m.save()
        user.is_ready = True

        self.all_messages[user.current_conversation].append(m)

        if self.all_players_ready():
            self.timer.cancel()
            self.next_round()

    def send_round_image(self, user, image):
        conv = self.conversations[user.current_conversation]

        """image_base = str(BASE_DIR) + "/ETMApp/static/"
        image_folder = "ETMApp/games/" + self.url + "/" + conv.url_conversation
        image_name = str(self.current_round) + ".png"
        image_url = image_folder + "/" + image_name
        image_path = image_base + image_url"""

        image_base = str(settings.MEDIA_ROOT) + "/"
        image_folder = "ETMApp/games/" + self.url + "/" + conv.url_conversation
        image_name = str(self.current_round) + ".png"
        image_url = image_folder + "/" + image_name
        image_path = image_base + image_url


        os.makedirs(image_base + image_folder, exist_ok = True)

        format, imgstr = image.split(';base64,')
        with open(image_path, "wb") as fh:
            fh.write(base64.b64decode(imgstr))

        print(image_url)

        m = Message.create_image(conv, user.getUser(), user.is_connected, image_url, len(self.all_messages[user.current_conversation]))
        m.save()
        user.is_ready = True

        self.all_messages[user.current_conversation].append(m)

        if self.all_players_ready():
            self.timer.cancel()
            self.next_round()

    def all_players_disconnected(self):
        for p in self.players:
            if not p.is_disconnected:
                return False
        return True

    def all_players_ready(self):
        for m in self.players:
            if not self.players[m].is_disconnected:
                if not self.players[m].is_ready:
                    return False
        return True

    def round_end(self):
        self.timer.cancel()
        self.send('round_end', {})

    def next_round(self):
        print("next round")
        self.current_round += 1

        if self.current_round >= self.nb_round:
            self.game_end()
            return


        for p in self.players.values():
            p.current_conversation = (p.index + self.current_round) % len(self.conversations)
            if self.current_round % 2:
                p.socket.send(text_data=json.dumps({
                    'type': 'new_round_draw',
                    'data': self.all_messages[p.current_conversation][-1].description
                }))
            else:
                p.socket.send(text_data=json.dumps({
                    'type': 'new_round_find',
                    'data': self.all_messages[p.current_conversation][-1].url_drawing
                }))
            p.is_ready = False
        self.timer = Timer(self.timer_time, self.round_end)
        self.timer.start()

    def game_end(self):
        print('game end')
        if not self.game_model.has_ended:
            self.game_model.has_ended = True
            self.game_model.save()
            
            self.send('end_game', {})
            self.remove_from_dict(self.url)

