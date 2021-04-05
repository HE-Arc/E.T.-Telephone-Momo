from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import string
import random


class Game(models.Model):
    date = models.DateTimeField('date published')
    url_game = models.CharField(max_length=8, unique=True)
    has_started = models.BooleanField(default=False)
    has_ended = models.BooleanField(default=False)
    @classmethod
    def create(cls):
        return cls(date=timezone.now(), url_game=id_generator(8))

    @classmethod
    def get_all_serializable(cls, id_user):
        games = set(Game.objects.filter(conversation__message__id_user=id_user))
        
        games = [g.get_serializable() for g in games]
        return games
        
    def get_serializable(self):
        players = list(User.objects.filter(message__id_conversation__id_game=self.id))
        players.extend(UserAnonyme.objects.filter(message__id_conversation__id_game=self.id))
        players = set(players)
        return {
            'date': self.date,
            'hasStarted': self.has_started,
            'hasEnded': self.has_ended,
            'urlGame': self.url_game,
            'players': [p.username for p in players]
            }

class UserAnonyme(models.Model):
    username = models.CharField(max_length=50)


class Conversation(models.Model):
    id_game = models.ForeignKey(Game, on_delete=models.CASCADE)
    url_conversation = models.CharField(max_length=8, unique=True)

    @classmethod
    def create(cls, id_game):
        return cls(id_game=id_game, url_conversation=id_generator(8))


    @classmethod
    def get_all_serializable(cls, url_game):
        conversations = Conversation.objects.filter(id_game__url_game=url_game)
        conversations = [c.get_serializable() for c in conversations]
        return conversations

    def get_serializable(self):
        messages = Message.objects.filter(id_conversation=self.id)

        return {
                'urlConversation': self.url_conversation,
                'messages': [m.get_serializable() for m in messages]
            }


class Message(models.Model):
    id_conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    id_user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    id_userAnonyme = models.ForeignKey(UserAnonyme, on_delete=models.DO_NOTHING, null=True)
    description = models.CharField(max_length=100, null=True)
    url_drawing = models.CharField(max_length=50, null=True)
    order = models.PositiveIntegerField()

    @classmethod
    def create_message(cls, id_conversation, id_user, is_connected, text, order):
        if is_connected:
            return cls(id_conversation=id_conversation, id_user=id_user, description=text, order=order)
        else:
            return cls(id_conversation=id_conversation, id_userAnonyme=id_user, description=text, order=order)

    @classmethod
    def create_image(cls, id_conversation, id_user, is_connected, image, order):
        if is_connected:
            return cls(id_conversation=id_conversation, id_user=id_user, url_drawing=image, order=order)
        else:
            return cls(id_conversation=id_conversation, id_userAnonyme=id_user, url_drawing=image, order=order)

    def get_serializable(self):
        user = None
        if (self.id_user != None):
            user = self.id_user
        else:
            user = self.id_userAnonyme
        return {
            'user': user.username,
            'url_drawing': self.url_drawing,
            'description': self.description
        }


class UserLike(models.Model):
    id_user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    id_message = models.ForeignKey(Message, on_delete=models.DO_NOTHING)


class UserGame(models.Model):
    id_game = models.ForeignKey(Game, on_delete=models.DO_NOTHING)
    id_message = models.ForeignKey(Message, on_delete=models.CASCADE)

def id_generator(size):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(size))