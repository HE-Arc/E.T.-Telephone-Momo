from ETMApp.models import UserAnonyme
from django.contrib.auth.models import User


class Member:
    def __init__(self, pseudo, id, is_connected, channel_name, socket):
        self.pseudo = pseudo
        self.id = id
        self.is_connected = is_connected
        self.channel_name = channel_name
        self.is_admin = False
        self.is_disconnected = False
        self.current_conversation = 0
        self.is_ready = False
        self.socket = socket
        self.index = 0

        

    def getUser(self):
        if self.is_connected:
            return User.objects.get(id=self.id)
        else:
            return UserAnonyme.objects.get(id=self.id)

    def get_serializable(self):
        return {
            'pseudo': self.pseudo,
            'id': self.id,
            'is_admin': self.is_admin,
            'is_disconnected': self.is_disconnected}


            