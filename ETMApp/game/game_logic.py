class GameLogic:
    def __init__(self, url):
        self.url = url
        self.players = {}

        self.channel_layer = get_channel_layer()
        self.group_send = async_to_sync(self.channel_layer.group_send)

    def add_player(self, member):
        self.players[member.id] = member
        self.update_player()

    def remove_player(self, member):
        del self.players[member.id]
        self.update_player()

    def update_player(self):
        self.send('lobby_players', [x.__dict__ for x in self.players.values()])

    def send(self, data_type, data):
        self.group_send(self.url,
                        {'type': 'message', 'data_type': data_type, 'data': data})