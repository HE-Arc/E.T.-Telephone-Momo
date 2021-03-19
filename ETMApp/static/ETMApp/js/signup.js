
//Password confirmation
let password = document.getElementById("password");
let confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match !");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.addEventListener('change', validatePassword);
confirm_password.addEventListener('change', validatePassword);