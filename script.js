let coins = 1000;
let minesGame = {
    active: false,
    bet: 0,
    multiplier: 1,
    openedCells: 0,
    minesCount: 3
};

// Общие функции
function updateCoins() {
    document.getElementById('coins').textContent = coins;
}

function deposit() {
    coins += 50;
    updateCoins();
    alert("+50 ŠKP! 🎉");
}

function blockedWithdraw() {
    alert("🚫 Вывод заблокирован!");
}

// ================ СЛОТЫ ================
function playSlots() {
    const bet = 10;
    if (coins < bet) {
        alert("Недостаточно ŠKP!");
        return;
    }
    coins -= bet;
    
    const slots = ['🍒', '💎', '🎰', '🍀', '⭐'];
    const results = [
        slots[Math.floor(Math.random() * slots.length)],
        slots[Math.floor(Math.random() * slots.length)],
        slots[Math.floor(Math.random() * slots.length)]
    ];

    // Обновление слотов
    document.getElementById('slot1').textContent = results[0];
    document.getElementById('slot2').textContent = results[1];
    document.getElementById('slot3').textContent = results[2];

    // Выплаты
    const unique = new Set(results).size;
    if (unique === 1) {
        coins += 10 * 20 * 0.98;
        alert("Джекпот! x20 🎉");
    } else if (unique === 2) {
        coins += 10 * 5 * 0.98;
        alert("Победа! x5 💰");
    }
    updateCoins();
}

// ================ MINES ================
function startMinesGame() {
    const bet = 50;
    if (coins < bet) {
        alert("Недостаточно ŠKP!");
        return;
    }
    
    coins -= bet;
    updateCoins();
    
    minesGame = {
        active: true,
        bet: bet,
        multiplier: 1,
        openedCells: 0,
        minesCount: parseInt(document.getElementById('minesCount').value),
        grid: Array(25).fill(false)
    };

    // Генерация мин
    for(let i = 0; i < minesGame.minesCount; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * 25);
        } while(minesGame.grid[randomIndex]);
        minesGame.grid[randomIndex] = true;
    }

    document.getElementById('minesModal').style.display = 'block';
    renderMinesGrid();
}

function renderMinesGrid() {
    const grid = document.getElementById('minesGrid');
    grid.innerHTML = '';
    
    for(let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.onclick = () => handleMineClick(i);
        cell.textContent = '?';
        grid.appendChild(cell);
    }
}

function handleMineClick(index) {
    if(!minesGame.active) return;
    
    const cell = document.getElementsByClassName('mine-cell')[index];
    if(minesGame.grid[index]) {
        // Мина
        minesGame.active = false;
        cell.textContent = '💣';
        cell.style.background = '#ff4444';
        alert(`BOOM! Проигрыш ${minesGame.bet} ŠKP`);
        closeMines();
    } else {
        // Безопасная клетка
        minesGame.openedCells++;
        cell.textContent = '💰';
        cell.style.background = '#4CAF50';
        cell.onclick = null;
        minesGame.multiplier = 1 + (minesGame.minesCount / (25 - minesGame.openedCells)) * 2;
        document.getElementById('minesMultiplier').textContent = 
            `Множитель: x${minesGame.multiplier.toFixed(2)}`;
    }
}

function cashoutMines() {
    if(!minesGame.active) return;
    
    const win = Math.floor(minesGame.bet * minesGame.multiplier * 0.98);
    coins += win;
    alert(`+${win} ŠKP (комиссия 2%) 🎉`);
    closeMines();
    updateCoins();
}

function closeMines() {
    minesGame.active = false;
    document.getElementById('minesModal').style.display = 'none';
}

// ================ БЛЭКДЖЕК ================
let bjGameActive = false;
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
    document.getElementById('bjPlayer').textContent = `Вы: ${playerHand.join(' ')}`;
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
    document.getElementById('bjPlayer').textContent = `Вы: ${playerHand.join(' ')} (${sum})`;
    if (sum > 21) endGame("Перебор! 💀");
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
