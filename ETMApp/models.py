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



class UserAnonyme(models.Model):
    pseudo = models.CharField(max_length=50)


class Conversation(models.Model):
    id_game = models.ForeignKey(Game, on_delete=models.CASCADE)
    url_conversation = models.CharField(max_length=8, unique=True)

    @classmethod
    def create(cls, id_game):
        return cls(id_game=id_game, url_conversation=id_generator(8))




class Message(models.Model):
    id_conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    id_user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    id_userAnonyme = models.ForeignKey(UserAnonyme, on_delete=models.DO_NOTHING, null=True)
    description = models.CharField(max_length=100, null=True)
    url_drawing = models.CharField(max_length=8, null=True)
    order = models.PositiveIntegerField()

    @classmethod
    def create_message(cls, id_conversation, id_user, is_connected, text, order):
        if is_connected:
            return cls(id_conversation=id_conversation, id_user=id_user, description=text, order=order)
        else:
            return cls(id_conversation=id_conversation, id_userAnonyme=id_user, description=text, order=order)

    @classmethod
    def create_image(cls, id_conversation, id_user, is_connected, image, order):
        #todo image
        if is_connected:
            return cls(id_conversation=id_conversation, id_user=id_user)
        else:
            return cls(id_conversation=id_conversation, id_userAnonyme=id_user)


class UserLike(models.Model):
    id_user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    id_message = models.ForeignKey(Message, on_delete=models.DO_NOTHING)


class UserGame(models.Model):
    id_game = models.ForeignKey(Game, on_delete=models.DO_NOTHING)
    id_message = models.ForeignKey(Message, on_delete=models.CASCADE)

def id_generator(size):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(size))