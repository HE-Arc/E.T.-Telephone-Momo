const conversation = JSON.parse(document.getElementById('conversation').textContent);
const game_url = JSON.parse(document.getElementById('game_url').textContent);

listMessages(conversation.messages);
