from ETMApp.models import UserAnonyme
from django.contrib.auth.models import User


class Member:
    def __init__(self, pseudo, id, is_connected, channel_name):
        self.pseudo = pseudo
        self.id = id
        self.is_connected = is_connected
        self.channel_name = channel_name
        self.is_admin = False
        self.is_disconnected = False
        self.current_conversation = 0
        

    def getUser(self):
        if self.is_connected:
            return User.objects.get(id=self.id)
        else:
            return UserAnonyme.objects.get(id=self.id)