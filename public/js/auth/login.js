const loginForm = document.getElementById('login-form');
const emInput = document.getElementById('em-input')
const passwordInput = document.getElementById('pwd-input');
const showPassword = document.getElementById('show-password')

function displayErrorMessage(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
}

const displayOutputMessage = (divId, message) => {
    document.getElementById('output-message').textContent = message;
    document.getElementById(divId).classList.toggle('hidden');
}


loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
        const response = await fetch('/auth/login', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({email, password})
        })

        const responseData = await response.json();
        
        if(!response.ok) {
            if(responseData.message.includes('Email')) {
                displayErrorMessage('email-error', responseData.message);
            } else {
                displayErrorMessage('email-error', "");
            }

            if(responseData.message.includes('Password')) {
                displayErrorMessage('password-error', responseData.message);
            } else {
                displayErrorMessage('password-error', "");
            }

            return ;
        }

        
        sessionStorage.setItem('username' , responseData.username);
        
        setTimeout(() => {
            loginForm.reset();
            displayOutputMessage('output-div', "");
            window.location.href = responseData.redirectURL
        }, 1500);
        displayOutputMessage('output-div', responseData.message);
        
    }
    catch (error) {
        console.log(error);
    }
})

// show password
showPassword.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'text' ? 'password' : 'text';
})

// hide display error message

emInput.addEventListener('input', (e) => {
    displayErrorMessage('email-error', '');
})

passwordInput.addEventListener('input', (e) => {
    displayErrorMessage('password-error', '');
})