const searchBoardBg = document.getElementById('search-board-bg');
const searchBoard = document.getElementById('search-board');
const hideCreateBoardModal = document.getElementById('hide-create-board-modal');
const createBoardModal = document.getElementById('create-board-modal');
const commentInput = document.getElementById('comment');
const conversationDiv = document.getElementById('conversation');
const defaultCommentP = document.getElementById('default-comment');


const setSearchBoardPosition = () => {
    const targetDiv = document.getElementById('board-search');
    const targetRect = targetDiv.getBoundingClientRect();

    const bottomPosition = targetRect.bottom + 40;
    const leftPosition = targetRect.left;

    searchBoard.style.left = leftPosition + 'px';
    searchBoard.style.top = bottomPosition + 'px';
}

// search function implementation for boards

const search = () => {
    const searchBar = document.getElementById('search-bar');
    let filterWord = searchBar.value;

    const searchList = document.getElementById('search-list');

    let li = searchList.getElementsByTagName('li');

    let cnt = 0;
    for(let i = 0; i < li.length; i++) {
        let textValue = li[i].textContent || li[i].innerText;
        if(textValue.indexOf(filterWord) > -1) {
            li[i].style.display = "";
        } else {
            cnt++;
            li[i].style.display = "none";
        }
    }

    
    // if(li.length === cnt) {
    //     p.style.display = "none";
    // } else {
    //     p.style.display = "";
    // }

}

// functionality to save to different boards

const savePin = (boardID, pinID) => {

    const url = `/board/${boardID}/save/${pinID}`;

    $.ajax({
        url : url,
        method : 'POST',
        success : (data) => {
            $('#search-board-bg').addClass('hidden');
            $('#search-board').addClass('hidden');
            $('#unsaved-div').addClass('hidden');
            $('#saved-title').text(data.pinSavedAt);
            $('#saved-div').removeClass('hidden');
        },
        error : (xhr, status, error) => {
            console.log(xhr, status, error);
        }
    })

    // fetch(url, options)
    // .then(response => {
    //     if(!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     window.location.href = data.redirectURL;
    // })
    // .catch(error => {
    //     console.log("Error : ", error);
    // });
}

// window.onload = () => {
//     setSearchBoardPosition();
// }

window.addEventListener('resize', () => {
    setSearchBoardPosition();
})

searchBoardBg.addEventListener('click', () => {
    searchBoardBg.classList.toggle('hidden');
    searchBoard.classList.toggle('hidden')
})

document.getElementById('board-search').addEventListener('click', () => {
    searchBoardBg.classList.toggle('hidden');
    searchBoard.classList.toggle('hidden');
})

// functionality to show create board modal 

document.getElementById('always-displayed').addEventListener('click', () => {
    createBoardModal.classList.remove('hidden')
    searchBoardBg.classList.toggle('hidden');
    searchBoard.classList.toggle('hidden');
})

hideCreateBoardModal.addEventListener('click', () => {
    createBoardModal.classList.add('hidden')
})

// like and unlike 
// const likeBtn = document.getElementById('heart-button');
// like


$(document).ready(() => {

    // get the initial data 
    setSearchBoardPosition();

    //  code for initial request to get the data when window is opened
    $.ajax({
        type : 'GET',
        url : `/pin/PinData/${pinId}`,
        success : (data) => {
            if(data.isPinSaved) {
                $('#unsaved-div').addClass('hidden');
                $('#saved-title').text(data.pinSavedAt);
                $('#saved-div').removeClass('hidden');
            } else {
                $('#unsaved-div').removeClass('hidden');
                $('#saved-div').addClass('hidden');
            }
            if(data.isLiked) {
                $('#like-button').addClass('hidden');
                $('#unlike-button').removeClass('hidden');
            } else {
                $('#like-button').removeClass('hidden');
                $('#unlike-button').addClass('hidden');
            }
            $('#likeCount').text(data.likeCount);
        }, error : (xhr, status, error) => {
            console.log(xhr, status, error);
        }
    })


    // all the user to save the pin into quick save
    $('#save-btn').click( () => {
        $.ajax({
            type : 'POST',
            url : `/pin/save/${pinId}`,
            success : (data) => {
                $('#unsaved-div').addClass('hidden');
                $('#saved-title').text(data.pinSavedAt);
                $('#saved-div').removeClass('hidden');
            }, error : (xhr, status, error) => {
                console.log(xhr, status, error);
            }
        })
    })

    // all the user to unsave the pin
    $('#unsave-btn').click( () => {
        const boardName = $('#saved-title').text();
        let url;
        if(boardName === 'profile') url = `/pin/unsave/${pinId}`;
        else url = `/pin/unsave/${pinId}/${boardName}`;
        console.log('data', boardName);
        $.ajax({
            type : 'POST',
            url : url,
            success : (data) => {
                
                $('#unsaved-div').removeClass('hidden');
                $('#saved-div').addClass('hidden');

            }, error : (xhr, status, error) => {
                console.log(xhr, status, error);
            }
        })
    })


    $('#hide-create-board-modal').click( (e) => {
        e.preventDefault();
        $('#create-board-save-pin')[0].reset();
        $('#create-board-modal').addClass('hidden');
    })

    // to create a new board and save the pin to it

    $('#create-board-save-pin').submit( (e) => {

        e.preventDefault();

        let name = $('#name').val();
        let secret = $('#secret').val();

        if(name.trim() === '') {
            return ;
        }

        $.ajax({
            type : 'POST',
            url : `/board/create/save/${pinId}`,
            data : {name, secret},
            success : (data) => {

                if(data.message && data.message.includes('board')) {
                    $('#board-error').text(data.message);
                    return ;
                }
                console.log(data);
                $('#create-board-save-pin')[0].reset();
                $('#board-error').text("");
                $('#search-list').append(`<li class="w-full px-4 py-4 hover:bg-slate-300" onclick="savePin(${data.boardId}, ${data.pinId})">` + data.pinSavedAt + '</li>');
                $('#create-board-modal').addClass('hidden');
                $('#unsaved-div').addClass('hidden');
                $('#saved-title').text(data.pinSavedAt);
                $('#saved-div').removeClass('hidden');
            }
        })
    })

    //  like button
    $('#like-button').click(() => {
        $.ajax({
            type : 'POST',
            url : `/pin/like/${pinId}`,
            success : (data) => {
                $('#like-button').addClass('hidden');
                $('#unlike-button').removeClass('hidden');
                $('#likeCount').text(data.likeCount);
            }
        })
    })


    // unlike button 
    $('#unlike-button').click(() => {
        $.ajax({
            type : 'POST',
            url : `/pin/unlike/${pinId}`,
            success : (data) => {
                $('#like-button').removeClass('hidden');
                $('#unlike-button').addClass('hidden');
                $('#likeCount').text(data.likeCount);
            }
        })
    })

    // comment 
    $('#comment').keypress((e) => {

        if(e.keyCode === 13 || e.which === 13) {
            e.preventDefault();

            const message = $('#comment').val();
            if(!message || message == '') {
                return ;
            }
            $.ajax({
                type : 'POST',
                url : `/pin/${pinId}/comment`,
                data : {message},
                success : (data) => {
                    console.log(data);
                    $('#default-comment').addClass('hidden');
                    $('#conversation').append(`<p class="text-sm">${message}</p>`)
                    $('#comment').val("");
                }
            })

        }
        
    })
})



// comment sending function

const sendData = (data) => {
    
}

// add comments 
commentInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        sendData(commentInput.value);
    }
})

