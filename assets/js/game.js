import {destructor} from "./constructors.js";

let deck = []
let currentCards = []
const btnHit = document.querySelector('.btn-hit')
const btnStand = document.querySelector('.btn-stand')
const btnNew = document.querySelector('.btn-new')
const playerLabelPoints = document.querySelector('#player-points')
const houseLabelPoints = document.querySelector('#house-points')
const playerCardsContainer = document.querySelector('#player-cards')
const houseCardsContainer = document.querySelector('#house-cards')
let playerPoints = 0
let housePoints = 0

const createDeck = () =>{
    const types = ['C', 'D', 'H', 'S']
    const figures = ['A', 'J', 'Q', 'K']
    for(let i = 2; i <= 10; i++){
        for (let type of types) {
            deck.push(i + type)
        }
    }

    for (let figure of figures){
        for (let type of types){
            deck.push(figure + type)
        }
    }

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

const showCard = (currentCard, owner) => {
    const card = document.createElement('img')
    card.classList.add('played-card')
    card.src = `./assets/cards/${currentCard}.svg`

    owner === 'player'? playerCardsContainer.appendChild(card) : houseCardsContainer.appendChild(card)
}


const hit = () => {
    if(deck.length === 0){
        throw 'no hay cartas en el deck'
    }
    return deck.pop()
}

const cardValue = (card) => {
    const value = card.substring(0, card.length -1)
    return (isNaN(value)? (value === 'A'? 11 : 10): parseInt(value))
}

btnHit.addEventListener('click', ()=> {
    const card = hit()
    currentCards.push(cardValue(card))
    playerPoints += cardValue(card)
    playerLabelPoints.innerText = playerPoints

    showCard(card, 'player')

    if(playerPoints > 21 && currentCards.indexOf(11) >= 0 ){
        currentCards[currentCards.indexOf(11)] = 1
        playerPoints -= 10
        playerLabelPoints.innerText = playerPoints
    }

    if (playerPoints > 21){
        console.log("Perdiste")
        btnHit.disabled = true
    } else if (playerPoints === 21){
        console.log("21, Ganaste!!!")
        btnHit.disabled = true
    }
})

btnStand.addEventListener('click', ()=> {

    btnHit.disabled = true
    btnStand.disabled = true

   do {
        const card = hit()
        housePoints += cardValue(card)
        houseLabelPoints.innerText = housePoints
        showCard(card, 'house')
       if (playerPoints > 21){
           break
       }
    }  while (housePoints < playerPoints && housePoints <= 21)

housePoints <= 21 ? console.log("Gana la casa") : console.log("Ganaste!!!")
})

btnNew.addEventListener('click', ()=> {

    destructor(playerCardsContainer)
    destructor(houseCardsContainer)

    currentCards = []
    btnHit.disabled = false
    btnStand.disabled = false

    playerPoints = 0
    housePoints = 0

    houseLabelPoints.innerText = housePoints
    playerLabelPoints.innerText = playerPoints

    createDeck()
})

createDeck()