/***** Constantes *****/
const email = document.querySelector(".login-email");
const password = document.querySelector(".login-password");
const loginButton = document.querySelector(".login-button");
const loginError = document.querySelector(".login-error");

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
        })
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("token", data.token);
            if (data.token) {
                document.location.href = "index.html";
            } else {
                loginError.style.display = "flex";
            }
        });
}

loginButton.addEventListener("click", login);