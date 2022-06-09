import { WORDS } from './words.js';
const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');
const resetBtn = document.querySelector('.reset');
const wordle = "";
let currentWordle = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
let currentWordleIndex = 0;
let currentWord;

initLocalStorage();

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]

function initLocalStorage(){
    const storedCurrentWordle =
    window.localStorage.getItem("currentWordle");
    if(!storedCurrentWordle){
        window.localStorage.setItem("currentWordle", currentWordle)
    } else {
        currentWord = storedCurrentWordle;
    }
}

function updateWordle(){
    localStorage.clear();
    initLocalStorage();
}

resetBtn.addEventListener('click', resetGame);

function resetGame(){
    return window.location.reload();
}

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']

]

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div');
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.classList.add('tile');
        rowElement.append(tileElement);
    })
    tileDisplay.append(rowElement);
})



keys.forEach(key => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click', () => handleClick(key));
    keyboard.append(buttonElement);
});

const handleClick = (letter) => {
    
    if (letter === '«') {
        deleteLetter();
        return;
    }
    if (letter === 'ENTER') {
        checkValid();
        return;
    }
    addLetter(letter);
}

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        tilePop();
        currentTile++;
        console.log('guessRows', guessRows);
    }

}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guessRows[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
        // tilePopRemove();
    }

}

const checkRow = () => {
    const guess = guessRows[currentRow].join('');

    if (currentTile > 4) {
      
        if (currentWord === guess) {
            flipTile();
            showMessage('You got it!');
            isGameOver = true;
            tileAnimate();
            currentRow++;
            resetBtn.style.visibility = "visible"; 
            updateWordle();
            return;
        } else {
            if (currentRow >= 5) {
                isGameOver = true;
                showMessage('Out of guesses');
                resetBtn.style.visibility = "visible"; 
                return;
            }
            if (currentRow < 5) {
                flipTile();
                currentRow++;
                currentTile = 0;
            }
        }
    }
}



const showMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => messageDisplay.removeChild(messageElement), 4000);
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter);
    key.classList.add(color);
}


const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWordle = currentWord;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
    })

    guess.forEach((guess, index) => {
        if (guess.letter == currentWord[index]) {
            guess.color = 'green-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    })


    rowTiles.forEach((tile, index) => {

        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color);
        }, 500 * index)
    })
}

const checkValid = () => {
    const guessStr = guessRows[currentRow].join('');
    if(!WORDS.includes(guessStr.toLowerCase())){
        showMessage("Not in word list")
    }else {
        checkRow();
    }
}

const tileAnimate = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
 
setTimeout(() => {


    rowTiles.forEach((tile, index) => {
        
        setTimeout(() => {
            tile.classList.add('animate');
            
        }, 500 * index)
    })
}, 2500)
}

const tilePop =() => {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.classList.add('pop');
}

const tilePopRemove =() => {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.classList.remove('pop');
}