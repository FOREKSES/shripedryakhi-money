let coins = 1000;

// Обновление счёта
function updateCoins() {
    document.getElementById('coins').textContent = coins;
}

// Депозит
function deposit() {
    coins += 50;
    updateCoins();
    alert("+50 ŠKP! Лосяш одобряет ваш 'депозит' 🌟");
}

// Вывод (заблокирован)
function blockedWithdraw() {
    alert("Крош сказал: 'Вывод ŠKP? Это не по-понятиям!' 🚫");
}

// ... Код игр (слоты, рулетка, блэкджек) из предыдущего ответа ...