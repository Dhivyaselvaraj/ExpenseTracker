const balance = document.getElementById("balance");
const amnt_add = document.getElementById("amnt-add");
const amnt_minus = document.getElementById("amnt-minus");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const lshistory = document.getElementById("lshistory");
const form = document.getElementById('form');

const localStorageData = JSON.parse(
    localStorage.getItem('data')
);

let data =
    localStorage.getItem('data') !== null ? localStorageData : [];

// Add transaction
function addTransaction(event) {
    event.preventDefault();

    if (text.value == "") {
        alert('Please add text');
    } else if (amount.value == "") {
        alert('Please add amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };

        data.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const list = document.createElement('li');

    // Add class based on value
    list.classList.add(transaction.amount < 0 ? 'negative' : 'positive');

    list.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

    lshistory.appendChild(list);
}

// Update the balance, income and expense
function updateValues() {
    const amounts = data.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, list) => (acc += list), 0).toFixed(2);

    const income = amounts
        .filter(list => list > 0)
        .reduce((acc, list) => (acc += list), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(list => list < 0).reduce((acc, list) => (acc += list), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    amnt_add.innerText = `$${income}`;
    amnt_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    data = data.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage data
function updateLocalStorage() {
    localStorage.setItem('data', JSON.stringify(data));
}

// Initialization 
function init() {
    lshistory.innerHTML = '';

    data.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener("submit", addTransaction);