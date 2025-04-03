let coins = 1000;
let minesGameActive = false;
let minesData = [];
let currentMultiplier = 1;
const COMISSION = 0.02;

// Mines-режим
function startMinesGame() {
    const bet = parseInt(document.getElementById('betAmount').value);
    if (coins < bet || isNaN(bet)) {
        alert("Недостаточно ŠKP!");
        return;
    }
    coins -= bet;
    updateCoins();

    const minesCount = parseInt(document.getElementById('minesCount').value);
    minesData = Array(25).fill(false);
    
    // Генерация мин
    for (let i = 0; i < minesCount; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * 25);
        } while (minesData[randomIndex]);
        minesData[randomIndex] = true;
    }

    currentMultiplier = 1;
    minesGameActive = true;
    renderMinesGrid();
    updateMultiplier();
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
        alert(`БАМ! Вы проиграли ${document.getElementById('betAmount').value} ŠKP`);
    } else {
        cell.textContent = '💰';
        cell.classList.add('safe');
        currentMultiplier += calculateMultiplierBoost();
        updateMultiplier();
    }
}

function calculateMultiplierBoost() {
    const minesCount = parseInt(document.getElementById('minesCount').value);
    return (0.25 * minesCount) / (25 - minesCount);
}

function updateMultiplier() {
    document.getElementById('minesMultiplier').textContent = 
        `Множитель: x${currentMultiplier.toFixed(2)}`;
}

// Обновленные слоты с комиссией
function playSlots() {
    const bet = 10; // Фиксированная ставка для слотов
    if (coins < bet) {
        alert("Недостаточно ŠKP!");
        return;
    }
    coins -= bet;
    updateCoins();

    // ... (код слотов из предыдущей версии) ...

    // Пример выигрыша с комиссией
    const winAmount = 100;
    coins += winAmount * (1 - COMISSION);
    updateCoins();
}

// Система ставок
document.getElementById('betAmount').addEventListener('input', function(e) {
    const bet = Math.max(10, parseInt(e.target.value) || 10;
    e.target.value = bet;
    document.querySelectorAll('#slotsBet, #minesBet').forEach(el => {
        el.textContent = bet;
    });
});