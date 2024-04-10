const form = document.getElementById('forgot-password-form');
const otpDiv = document.getElementById('otp-div');
const submitBtn = document.getElementById('submit-btn');

function displayErrorMessage(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
}

const sendOTPFetchRequest = async (email) => {
    try {
        const response = await fetch('/auth/forgot-password-send-otp', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({email})
        })
        const responseData = await response.json();
        if(!response.ok) {
            if(responseData.message.includes('Email')) {
                displayErrorMessage('email-error', responseData.message);
            } else {
                displayErrorMessage('email-error', "");
            }
            
            return ;
        }
        alert(responseData.message);
        otpDiv.classList.remove('hidden');
        submitBtn.innerText = "verify OTP";
    } catch(err) {
        console.log(err);
    }
    
}

const verifyOTPFetchRequest = async (email, otp) => {
    try {
        const response = await fetch('/auth/forgot-password-verify-otp', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({email, otp})
        })

        const responseData = await response.json();

        if(!response.ok) {
            if(responseData.message.includes("OTP")) {
                displayErrorMessage('otp-error', responseData.message);
            } else {
                displayErrorMessage('otp-error', responseData.message);
            }
            return ;
        }

        alert(responseData.message);

        window.location.href = "/auth/new-password";

    } catch(error) {
        console.log(error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value;
    const otp = form.otp.value;

    if(email === "") return; 

    if(otpDiv.classList.contains('hidden')) {
        sendOTPFetchRequest(email);
    } else {
        if(otp === "") return ;
        verifyOTPFetchRequest(email, otp);
    }
})

