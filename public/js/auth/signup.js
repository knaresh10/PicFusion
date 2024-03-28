const form = document.getElementById('signup-form');
const divOTP = document.getElementById('div-otp');
const formBtn = document.querySelector('form button')
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("em-input");
const pwdInput = document.getElementById('pwd-input');
const showPwd = document.getElementById('show-password');
const confirmPwdInput = document.getElementById('confirm-pwd-input');
const showConfirmPwd = document.getElementById('show-confirm-password');
const otpInput = document.getElementById('otp-input');
const showOtp = document.getElementById('show-otp');


function displayErrorMessage(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
}


const displayOutputMessage = (divId, message) => {
    document.getElementById(divId).classList.toggle('hidden');
    // document.getElementById(msgId).textContent = message;
}


const sendOTP = async (userData) => {
    try {
        const response = await fetch('/auth/send-otp', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(userData)
        })

        const responseData = await response.json();
        
        if(!response.ok) {
            console.log(responseData.message)
            if(responseData.message.includes('Username')) {
                displayErrorMessage('username-error', responseData.message);
            } else {
                displayErrorMessage('username-error', "")
            }
            if(responseData.message.includes('Email')) {
                displayErrorMessage('email-error', responseData.message)
            } else {
                displayErrorMessage('email-error', "");
            }

            return ;
        } 

        usernameInput.readOnly = true;
        emailInput.readOnly = true;
        pwdInput.readOnly = true;
        confirmPwdInput.readOnly = true;
        
        
        setTimeout(() => {
            displayOutputMessage('output-div');
        }, 1000);
        displayOutputMessage('output-div');

        console.log(responseData);

        divOTP.classList.remove('hidden');

        formBtn.innerText = 'verify OTP'
        
        return ;

    }  
    catch(error) {
        console.error('Error registering user:', error.message);
        displayErrorMessage('username-error', 'An error occurred. Please try again later.');
        displayErrorMessage('email-error', 'An error occurred. Please try again later.');
    }  
}

const verifyOTP = async (userData) => {
    try {
        const response = await fetch('/auth/verify-otp', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(userData)
        })

        const responseData = await response.json();
        
        if(!response.ok) {

            if(responseData.message.contains('otp')) {
                displayErrorMessage('otp-error', responseData.message);
            } else {
                displayErrorMessage('otp-error', "");
            }
            
            return ;
        } 

        form.reset();
        alert(responseData.message);

        window.location.href = responseData.redirectURL

    }  
    catch(error) {
        console.error('Error registering user:', error.message);
        displayErrorMessage('username-error', 'An error occurred. Please try again later.');
        displayErrorMessage('email-error', 'An error occurred. Please try again later.');
    }  
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = form.username.value
    const email = form.email.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value;
    const otp = form.otp.value;

    if(password != confirmPassword) {
        return ;
    }

    // first fetch request to send otp

    if(divOTP.classList.contains('hidden')) {
        sendOTP({username, email, password});
    } else {
        verifyOTP({otp})
    }

})

// update error messages 
// username


usernameInput.addEventListener('input', (e) => {
    displayErrorMessage('username-error', '');
})

// email


emailInput.addEventListener('input', (e) => {
    displayErrorMessage('email-error', "");
})


// show password


showPwd.addEventListener('click', () => {
    pwdInput.type = pwdInput.type == 'text' ? 'password' : 'text';
})

// show confirm password


showConfirmPwd.addEventListener('click', () => {
    confirmPwdInput.type = confirmPwdInput.type == 'text' ? 'password' : 'text';
})

// show otp


showOtp.addEventListener('click', () => {
    otpInput.type = otpInput.type == 'text' ? 'password' : 'text';
})

// password minimum length
const updatePasswordRequirement = (pwd) => {
    if(pwd.length > 0 && pwd.length < 8) {
        document.getElementById('password-error').innerText = "password should be minimum 8 letters"
    } else {
        document.getElementById('password-error').innerText = ""
    }
}

pwdInput.addEventListener('input', (e) => {
    const password = e.target.value;
    updatePasswordRequirement(password);
})

// match confirm password with password
const matchPassword = (pwd, confirmPwd) => {
    if(pwd !== confirmPwd) {
        document.getElementById('confirm-password-error').innerText = "password doesn't match"
    } else {
        document.getElementById('confirm-password-error').innerText = ""
    }
}

confirmPwdInput.addEventListener('input', (e) => {
    const password = pwdInput.value;
    const confirmPassword = e.target.value;
    console.log(password, confirmPassword);
    matchPassword(password, confirmPassword);
})