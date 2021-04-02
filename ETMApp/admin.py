from django.contrib import admin
from ETMApp.models import *
# Register your models here.


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    pass

@admin.register(UserAnonyme)
class UserAnonymeAdmin(admin.ModelAdmin):
    pass

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    pass

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    pass

@admin.register(UserLike)
class UserLikeAdmin(admin.ModelAdmin):
    pass

@admin.register(UserGame)
class UserGameAdmin(admin.ModelAdmin):
    pass