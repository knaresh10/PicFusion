const searchBoardBg = document.getElementById('search-board-bg');
const searchBoard = document.getElementById('search-board');
const hideCreateBoardModal = document.getElementById('hide-create-board-modal');
const createBoardModal = document.getElementById('create-board-modal');

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

    let p = searchList.getElementsByTagName('p')
    if(li.length === cnt) {
        p[0].style.display = "none";
    } else {
        p[0].style.display = "";
    }

}

// functionality to save to different boards

const savePin = (boardID, pinID) => {
    const options = {
        method : 'POST',
    };

    const url = `/board/${boardID}/save/${pinID}`;
    console.log(url)

    fetch(url, options)
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        window.location.href = data.redirectURL;
    })
    .catch(error => {
        console.log("Error : ", error);
    });
}

window.onload = () => {
    setSearchBoardPosition();
}

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

