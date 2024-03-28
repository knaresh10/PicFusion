// update the profile pic when uploaded a new profile pic
document.querySelector('#upload-icon').addEventListener('click', () => {
    document.querySelector('#profile-pic').click();
});

document.querySelector('#profile-pic').addEventListener('change', (event) => {
    const input = event.target;
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.querySelector('#profile-display').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
})






