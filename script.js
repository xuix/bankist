'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const displayMovements = (movements, sorted = false) => {
  console.log('movements =', sorted, movements);
  //empty the Movements container
  containerMovements.innerHTML = '';
  //using sort on movements will mutate the array. use the slice function to
  //create a copy of the array, and leave the original untouched
  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
                  <div class="movements__value"> £ ${mov}</div>
                  </div>`;
    //insert the movements onto the DOM
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNames = accs => {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

const calcDisplayBalance = acc => {
  //create a new balance field on the account object
  acc.balance = acc.movements.reduce((accum, mov, i) => {
    return accum + mov;
  }, 0);
  labelBalance.textContent = `£ ${acc.balance}`;
};

const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((accum, mov) => accum + mov, 0);
  labelSumIn.textContent = `£ ${incomes}`;

  const outgoings = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log('outgoings=', outgoings);
  labelSumOut.textContent = `£ ${Math.abs(outgoings)}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `£ ${Math.trunc(interest)}`;
};

createUserNames(accounts);
console.log('usernames', accounts);

let currentAccount;
//login Event Handler

const updateUi = acc => {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
const login = e => {
  //prevent form from submitting
  e.preventDefault();
  console.log('click=', accounts, inputLoginUsername.value);
  currentAccount = accounts.find(
    acct => acct.username === inputLoginUsername.value
  );
  console.log('currentAccount=', currentAccount?.pin, inputLoginPin.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('logged in');
    //display ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    //remove focus from pin
    inputLoginPin.blur();

    //display movements
    //display balance
    //display summary
    updateUi(currentAccount);
  } else {
    console.log('login failed');
  }
};
btnLogin.addEventListener('click', login);

//transfer EventListener
const transfer = e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  //find the reciever account from the input username
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log('receiver acc=', receiverAcc);

  if (
    // Check if the receiverAcc exists
    receiverAcc &&
    amount > 0 &&
    amount < currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('transfer valid=', receiverAcc, amount);
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(currentAccount);
  } else {
    console.log('invalid transfer=', receiverAcc, amount);
  }
  //reset the values
  inputTransferAmount.value = inputTransferTo.value = '';
};

btnTransfer.addEventListener('click', transfer);
//Request Loan Eventlistenter
const requestLoan = e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => amount < mov * 0.1)) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  } else {
    console.log('Loan reques rejected');
  }
  inputLoanAmount.value = '';
};
btnLoan.addEventListener('click', requestLoan);
//Close Account EventListener
const closeAccount = e => {
  e.preventDefault();
  console.log('closeAccount=');
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (username === currentAccount.username && pin === currentAccount.pin) {
    //find the index of the account in the accounts array
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log('CloseValidated=', index);
    // delete the account
    accounts.splice(index, 1);
    //* log the user out by hiding the ui
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  //reset the inputs to blank
  inputCloseUsername.value = inputClosePin.value = '';
};

btnClose.addEventListener('click', closeAccount);

const deposits = account1.movements.filter(mov => mov > 0);
console.log('deposits', deposits);
const withdrawals = account1.movements.filter(mov => mov < 0);
console.log('withdrawals', withdrawals);

//Sort Button EventListener

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault;
  console.log('=clicked');
  displayMovements(currentAccount.movements, sorted);
  //toggle the sorted flag
  sorted = !sorted;
});

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
