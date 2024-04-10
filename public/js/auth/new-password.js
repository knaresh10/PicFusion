// show password
const pwdInput = document.getElementById('pwd-input');
const showPwd = document.getElementById('show-password');

showPwd.addEventListener('click', () => {
    pwdInput.type = pwdInput.type == 'text' ? 'password' : 'text';
})

// show confirm password
const confirmPwdInput = document.getElementById('confirm-pwd-input');
const showConfirmPwd = document.getElementById('show-confirm-password');

showConfirmPwd.addEventListener('click', () => {
    confirmPwdInput.type = confirmPwdInput.type == 'text' ? 'password' : 'text';
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

// read the confirm password and check if it matches with password
confirmPwdInput.addEventListener('input', (e) => {
    const password = pwdInput.value;
    const confirmPassword = e.target.value;
    matchPassword(password, confirmPassword);
})


// form on submit
const form = document.getElementById("reset-password-form");

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if(password !== confirmPassword) return ;

    try {
        const response = await fetch('/auth/new-password', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({password}),
        })

        const responseData = await response.json();

        alert(responseData.message);
        window.location.href = '/auth/login';
    } catch (err) {
        console.log(err);
    }
})
