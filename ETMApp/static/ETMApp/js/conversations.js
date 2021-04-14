const conversations = JSON.parse(document.getElementById('conversations').textContent);
const game_url = JSON.parse(document.getElementById('game_url').textContent);
console.log(JSON.stringify(conversations));
listConversations(conversations);

function listConversations(conversations) {

    let table = document.getElementById('conversations_table');

    html = '';
    //Add parties in element then in the html table
    for (let conversation of conversations) {
        html += `
        <div class="mb-3 card overlay-container conversations-card">
            <image class="card-img-top card-image" src="/media/${htmlEntities(conversation.messages[1].url_drawing)}">
            <div class="overlay">
                <p class="overlay-text">Click to get the full conversation</p>
            </div>
            <div class="card-body">
                <h5 class="card-title">${htmlEntities(conversation.messages[0].user)} choose</h5> 
                <a class="stretched-link" href="${htmlEntities(conversation.urlConversation)}"></a>
                <p class="card-text crop-text-2">${htmlEntities(conversation.messages[0].description)}</p>
            </div>
        </div>
        `;
    }

    table.innerHTML = html;
}