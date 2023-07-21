/***** Constantes *****/
const email = document.querySelector(".login-email");
const password = document.querySelector(".login-password");
const error = document.querySelector(".error");
const loginButton = document.querySelector(".login-button");

/***** Fonctions *****/
function login() {
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
        mode: "cors",
        credentials: "same-origin",
    })
        .then(response => response.json())
        .then(data => {
            let token = data.token;
            localStorage.setItem("token", token);
            if (token) {
                window.location.href = "index.html";
            } else {
                error.style.display = "flex";
            }
        });
}

loginButton.addEventListener("click", login);