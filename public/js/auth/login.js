const loginForm = document.getElementById('login-form');

function displayErrorMessage(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
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

        loginForm.reset();
        alert(responseData.message);
           
        window.location.href = responseData.redirectURL
        
    }
    catch (error) {
        console.log(error);
    }
})