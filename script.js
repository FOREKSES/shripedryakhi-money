let coins = 1000;
let minesGameActive = false;
let bjGameActive = false;
let currentMultiplier = 1;
const COMISSION = 0.02;

// Общие функции
function updateCoins() {
    document.getElementById('coins').textContent = coins;
}

function deposit() {
    coins += 50;
    updateCoins();
    alert("+50 ŠKP! Лосяш одобряет 🌟");
}

function blockedWithdraw() {
    alert("Крош сказал: 'Это не по-понятиям!' 🚫");
}

// ================= СЛОТЫ =================
function playSlots() {
    const bet = 10;
    if (coins < bet) {
        alert("Недостаточно ŠKP!");
        return;
    }
    coins -= bet;
    updateCoins();

    const slots = ['🍒', '💎', '🎰', '🍀', '⭐'];
    const results = [
        slots[Math.floor(Math.random() * slots.length)],
        slots[Math.floor(Math.random() * slots.length)],
        slots[Math.floor(Math.random() * slots.length)]
    ];

    let multiplier = 1;
    const unique = new Set(results).size;

    if (unique === 1) multiplier = 20;
    else if (unique === 2) multiplier = 5;

    if (multiplier > 1) {
        const winAmount = bet * multiplier;
        coins += Math.floor(winAmount * (1 - COMISSION));
    }

    document.getElementById('slot1').textContent = results[0];
    document.getElementById('slot2').textContent = results[1];
    document.getElementById('slot3').textContent = results[2];
    document.getElementById('slotsMultiplier').textContent = `Множитель: x${multiplier}`;
    updateCoins();
}

// ================= MINES =================
let minesData = [];

function startMinesGame() {
    const bet = parseInt(document.getElementById('betAmount').value);
    if (coins < bet) {
        alert("Недостаточно ŠKP!");
        return;
    }
    coins -= bet;
    updateCoins();

    const minesCount = parseInt(document.getElementById('minesCount').value);
    minesData = Array(25).fill(false);
    
    for (let i = 0; i < minesCount; i++) {
        let randomIndex;
        do randomIndex = Math.floor(Math.random() * 25);
        while (minesData[randomIndex]);
        minesData[randomIndex] = true;
    }

    currentMultiplier = 1;
    minesGameActive = true;
    renderMinesGrid();
}

function renderMinesGrid() {
    const grid = document.getElementById('minesGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.onclick = () => handleMineClick(i);
        cell.textContent = '?';
        grid.appendChild(cell);
    }
}

function handleMineClick(index) {
    if (!minesGameActive) return;
    
    const cell = document.getElementsByClassName('mine-cell')[index];
    cell.classList.add('revealed');
    
    if (minesData[index]) {
        minesGameActive = false;
        cell.textContent = '💣';
        alert(`БАМ! Проигрыш ${document.getElementById('betAmount').value} ŠKP`);
    } else {
        cell.textContent = '💰';
        currentMultiplier += 0.5;
        document.getElementById('minesMultiplier').textContent = `Множитель: x${currentMultiplier.toFixed(1)}`;
    }
}

// ================= БЛЭКДЖЕК =================
let playerHand = [];
let dealerHand = [];

function startBlackjack() {
    if (coins < 30) {
        alert("Нужно 30 ŠKP!");
        return;
    }
    coins -= 30;
    updateCoins();
    
    playerHand = [getRandomCard(), getRandomCard()];
    dealerHand = [getRandomCard(), getRandomCard()];
    bjGameActive = true;
    
    document.getElementById('bjDealer').textContent = `Дилер: ${dealerHand[0]} ?`;
    document.getElementById('bjPlayer').textContent = `Игрок: ${playerHand.join(' ')}`;
    document.getElementById('bjResult').textContent = '';
}

function getRandomCard() {
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return cards[Math.floor(Math.random() * cards.length)];
}

function calculateHand(hand) {
    let sum = 0;
    let aces = 0;
    for (const card of hand) {
        if (card === 'A') {
            aces++;
            sum += 11;
        } else sum += isNaN(card) ? 10 : parseInt(card);
    }
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

function bjHit() {
    if (!bjGameActive) return;
    playerHand.push(getRandomCard());
    const sum = calculateHand(playerHand);
    document.getElementById('bjPlayer').textContent = `Игрок: ${playerHand.join(' ')} (${sum})`;
    if (sum > 21) endGame("Перебор! Проигрыш 💀");
}

function bjStand() {
    if (!bjGameActive) return;
    let dealerSum = calculateHand(dealerHand);
    while (dealerSum < 17) {
        dealerHand.push(getRandomCard());
        dealerSum = calculateHand(dealerHand);
    }
    const playerSum = calculateHand(playerHand);
    
    let result;
    if (playerSum > 21) result = "Проигрыш!";
    else if (dealerSum > 21 || playerSum > dealerSum) {
        coins += 60;
        result = "Победа! +60 ŠKP 🏆";
    } else if (playerSum === dealerSum) {
        coins += 30;
        result = "Ничья 🤝";
    } else result = "Дилер выиграл 😈";
    
    endGame(result);
}

function endGame(message) {
    document.getElementById('bjDealer').textContent = `Дилер: ${dealerHand.join(' ')} (${calculateHand(dealerHand)})`;
    document.getElementById('bjResult').textContent = message;
    bjGameActive = false;
    updateCoins();
}
