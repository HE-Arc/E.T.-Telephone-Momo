const conversations = JSON.parse(document.getElementById('conversations').textContent);
const game_url = JSON.parse(document.getElementById('game_url').textContent);
console.log(JSON.stringify(conversations));
listConversations(conversations);

function listConversations(conversations) {

    let table = document.getElementById('conversations_table');

    //Add parties in element then in the html table
    for (let conversation of conversations) {

        let card = document.createElement('div');
        card.classList.add("mb-3", "card", "overlay-container", "conversations-card");

        let html = `
            <image class="card-img-top card-image" src="/media/${conversation.messages[1].url_drawing}">
            <div class="overlay">
                <p class="overlay-text">Click to get the full conversation</p>
            </div>
            <div class="card-body">
                <h5 class="card-title">${conversation.messages[0].user} choose</h5>
                <a class="stretched-link" href="${game_url}/${conversation.urlConversation}"></a>
                <p class="card-text crop-text-2">${conversation.messages[0].description}</p>
            </div>
        `;

        card.innerHTML = html;
        table.appendChild(card);

        /*
        let card = document.createElement('div');
        card.classList.add("mb-3", "card", "overlay-container", "conversations-card");

        let image = document.createElement('img');
        image.classList.add('card-img-top');
        image.classList.add('card-image');
        image.setAttribute('src', '/media/' + conversation.messages[1].url_drawing);
        
        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        
        let text = document.createElement('p');
        text.classList.add('overlay-text');
        text.innerHTML = 'Click to get the full conversation';
        
        let body = document.createElement('div');
        body.classList.add('card-body');
        
        let title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerHTML = conversation.messages[0].user + ' choose';

        let link = document.createElement('a');
        link.classList.add('stretched-link');
        link.setAttribute('href',  game_url + '/' + conversation.urlConversation);

        let card_text = document.createElement('p');
        card_text.classList.add('card-text');
        card_text.classList.add('crop-text-2');
        card_text.innerHTML = conversation.messages[0].description;
        
        card.appendChild(image);
        overlay.appendChild(text);
        card.appendChild(overlay);
        body.appendChild(title);
        body.appendChild(link);
        body.appendChild(card_text);
        card.appendChild(body);
        table.appendChild(card);
        */
    }
}