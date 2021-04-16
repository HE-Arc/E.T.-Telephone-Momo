from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<game_url>\w+)/$', consumers.GameConsumer.as_asgi()),
]
