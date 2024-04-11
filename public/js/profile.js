
$(document).ready(() => {

    $('#hide-create-board-modal').click( (e) => {
        e.preventDefault();
        $('#board-create')[0].reset();
        $('#create-modal').addClass('hidden');
    })

    
    $('#board-create').submit((e) => {
        e.preventDefault();


        let name = $('#name').val();
        name = name.trim();
        if(name == '') {
            $('#board-error').text("board name can't be empty");
            $('#name').val('');
            return ;
        }
        
        const secret = $('#secret').val();
        
        $.ajax({
            type : 'POST',
            url : `/board/create`,
            data : {name , secret},
            success : (data) => {
                if(data.message && data.message.includes('board')) {
                    $('#board-error').text(data.message);
                    return ;
                }
                $('#board-create')[0].reset();
                $('#board-modal').addClass('hidden');
            }
        })
    })

    $('#create-btn').click(() => {
        $('#create-div').removeClass('hidden');
        $('#save-div').addClass('hidden');
    })

    $('#save-btn').click(() => {
        $('#create-div').addClass('hidden');
        $('#save-div').removeClass('hidden');
    })
})