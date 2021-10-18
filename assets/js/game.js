let deck = []
const URLPLAYERS = "./data/players.json"

let currentCards = []
let playerPoints = 0
let housePoints = 0
let betAmount = 10
let currentPlayer
let currentPlayerData

const getData = () => {
    $.getJSON(URLPLAYERS, function (respuesta, estado) {
        if (estado === "success") {
            for (const player of respuesta) {
                if (player.name === currentPlayer) {
                    $("#player-name").text(`${player.name} - `).append('<small id="player-points">0</small>')
                    $("#player-money").text(player.money)
                    currentPlayerData = player
                }
            }
        }
    })
}

const createDeck = () => {
    const types = ['C', 'D', 'H', 'S']
    const figures = ['A', 'J', 'Q', 'K']
    for (let i = 2; i <= 10; i++) {
        for (let type of types) {
            deck.push(i + type)
        }
    }

    for (let figure of figures) {
        for (let type of types) {
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
    owner === 'player' ? $("#player-cards").append(`<img alt=card src=\./assets/cards/${currentCard}.svg\ class=played-card>`).fadeIn() : $("#house-cards").append(`<img alt=card src=\./assets/cards/${currentCard}.svg\ class=played-card>`)
}


const hit = () => {
    if (deck.length === 0) {
        throw 'no hay cartas en el deck'
    }
    return deck.pop()
}

const cardValue = (card) => {
    const value = card.substring(0, card.length - 1)
    return (isNaN(value) ? (value === 'A' ? 11 : 10) : parseInt(value))
}

$(".btn-hit").on('click', () => {
    const card = hit()
    currentCards.push(cardValue(card))
    playerPoints += cardValue(card)
    $("#player-points").text(playerPoints)

    showCard(card, 'player')

    if (playerPoints > 21 && currentCards.indexOf(11) >= 0) {
        currentCards[currentCards.indexOf(11)] = 1
        playerPoints -= 10
        $("#player-points").text(playerPoints)
    }

    if (playerPoints > 21) {
        $("#result").text("La casa gana")
        currentPlayerData.money -= betAmount
        $("#player-money").text(currentPlayerData.money)
        $(".btn-hit").prop('disabled', true)
        $(".btn-stand").prop('disabled', true)
    } else if (playerPoints === 21) {
        $("#result").text("Ganaste")
        currentPlayerData.money += betAmount * 2
        $("#player-money").text(currentPlayerData.money)
        $(".btn-hit").prop('disabled', true)
        $(".btn-stand").prop('disabled', true)
    }
})

$(".btn-stand").on('click', () => {

    $(".btn-hit").prop('disabled', true)
    $(".btn-stand").prop('disabled', true)

    do {
        const card = hit()
        housePoints += cardValue(card)
        $("#house-points").text(housePoints)
        showCard(card, 'house')
        if (playerPoints > 21) {
            break
        }
    } while (housePoints < playerPoints && housePoints <= 21)

    if (housePoints <= 21) {
        $("#result").text("La casa gana")
        currentPlayerData.money -= betAmount
        $("#player-money").text(currentPlayerData.money)

    } else {
        $("#result").text("Ganaste")
        currentPlayerData.money += betAmount * 2
        $("#player-money").text(currentPlayerData.money)
    }
})

$(".btn-new").on('click', () => {

    $("#player-cards").empty()
    $("#house-cards").empty()

    currentCards = []
    $(".btn-hit").prop('disabled', false)
    $(".btn-stand").prop('disabled', false)

    playerPoints = 0
    housePoints = 0

    $("#house-points").text(housePoints)
    $("#player-points").text(playerPoints)
})

$(".btn-bet").on('click', () => {
    betAmount = $("#bet").val()

    $(".btn-hit").prop('disabled', false)
    $(".btn-stand").prop('disabled', false)
    $(".btn-new").prop('disabled', false)
    $(".btn-bet").prop('disabled', true)
})

$(".btn-player").on('click', () => {
    currentPlayer = $("#player").val()
    getData()
    $(".btn-bet").prop('disabled', false)
    $("#player-sel").hide()
    $("#buttons").fadeIn("slow").slideDown("slow")
})

$(window).on("load", () => {
    $("#buttons").hide()
    $.getJSON(URLPLAYERS, function (respuesta, estado) {
        if (estado === "success") {
            let i = 0
            for (const player of respuesta) {
                i++
                let text = player.name
                $("#player").append(`<option value=${text.replace(/ /g, "-")} id=option${i}> </option>`)
                $(`#option${i}`).text(text)
            }
        }
    })
})

createDeck()