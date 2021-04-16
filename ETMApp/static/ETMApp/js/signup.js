// Bind the input button to the function bellow
let formDiv = document.getElementById('signupForm');
formDiv.addEventListener('submit', (e) => {
    e.preventDefault();
    sendConnectionRequest();
});

//Password confirmation
let password = document.getElementById("password");
let confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value !== confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match !");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.addEventListener('change', validatePassword);
confirm_password.addEventListener('change', validatePassword);

function sendConnectionRequest() {
  let form = new FormData(formDiv);
  fetch("/trySignup", {
      method: "POST",
      body: form
  }).then(response => response.json())
  .then(data => {
      // If signup succed
      if(!data.error)
        window.location.href = '/';
      else
        switch(data.msg) {
            case 'invalid_data':
                document.getElementById('errorData').removeAttribute('hidden');
                break;
            case 'user_already_exist':
                document.getElementById('errorAlreadyExist').removeAttribute('hidden');
                break;
        }
  });
}