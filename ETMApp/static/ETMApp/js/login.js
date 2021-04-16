// Bind the input button to the function bellow
let formDiv = document.getElementById('loginForm');
formDiv.addEventListener('submit', (e) => {
    e.preventDefault();
    sendConnectionRequest();
});


function sendConnectionRequest() {
    let form = new FormData(formDiv);
    fetch("/tryLogin", {
        method: "POST",
        body: form
    }).then(response => response.json())
    .then(data => {
        // If connection succed
        if(!data.error)
            window.location.href = '/';
        else
            switch(data.msg) {
                case 'invalid_credentials':
                    document.getElementById('errorConnection').removeAttribute('hidden');
                    break;
                case 'already_connected':
                    document.getElementById('errorAlreadyConnected').removeAttribute('hidden');
                    break;
            }
    });
  }