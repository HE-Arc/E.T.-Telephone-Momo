const conversations = JSON.parse(document.getElementById('conversations').textContent);
const game_url = JSON.parse(document.getElementById('game_url').textContent);
listConversations(conversations);

function listConversations(conversations) {

    let table = document.getElementById('conversations_table');

    //Add parties in element then in the html table
    for (let conversation of conversations) {
        let card = document.createElement('div');
        card.classList.add("mb-3");
        card.classList.add("card");
        card.classList.add("overlay-container");
        card.classList.add("conversations-card");

        let image = document.createElement('img');
        image.classList.add('card-img-top');
        image.classList.add('card-image');
        image.setAttribute('src', '/media/' + conversation.messages[1].url_drawing);
        card.appendChild(image);

        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        let text = document.createElement('p');
        text.classList.add('overlay-text');
        text.innerHTML = 'Click to get the full conversation';
        overlay.appendChild(text);
        card.appendChild(overlay);

        let body = document.createElement('div');
        body.classList.add('card-body');
        let title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerHTML = conversation.messages[0].user + ' choose';
        body.appendChild(title);
        let link = document.createElement('a');
        link.classList.add('stretched-link');
        link.setAttribute('href',  game_url + '/' + conversation.urlConversation + '"');
        link.setAttribute('style', "display:none");
        body.appendChild(link);
        let card_text = document.createElement('p');
        card_text.classList.add('card-text');
        card_text.classList.add('crop-text-2');
        card_text.innerHTML = conversation.messages[0].description;
        body.appendChild(card_text);
        card.appendChild(body);

        table.appendChild(card);
    }
}