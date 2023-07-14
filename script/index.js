function login(){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if(email && password){
        window.location.href = 'ttn.html';
    }
}

