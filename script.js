'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2024-07-11T23:36:17.929Z',
    '2024-07-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// Functions

const fomratMovementDate = function (date, locale){
    const calcdaysPast = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))


    const daysPast = calcdaysPast(new Date(), date);
    console.log(daysPast);

    if (daysPast === 1) return 'Yesterday'
    
    if (daysPast === 0) return 'Today'
    if (daysPast <= 7){
      return `${daysPast} days ago`
    }else{
      // const day = `${date.getDate()}`.padStart(2, 0)
      // const month = `${date.getMonth() + 1}`.padStart(2, 0)
      // const year = date.getFullYear()

      
      // return `${day}/${month}/${year}`
      return new Intl.DateTimeFormat(locale).format(date)
    }    
}

const formatCurr = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value)
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = fomratMovementDate(date, acc.locale)
    

    const formattedMov = formatCurr(mov,acc.locale, acc.currency)


    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  
  labelBalance.textContent = formatCurr(acc.balance,acc.locale, acc.currency)
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(incomes,acc.locale, acc.currency)

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out),acc.locale, acc.currency)

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest,acc.locale, acc.currency)
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// FAKE ALWAYS LOG IN

currentAccount = account1
updateUI(currentAccount)
containerApp.style.opacity = 100


// API



btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // CREATE CURRENT DATE
    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long'
    }

    // const local = navigator.language
    // console.log(navigator);

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now)
    // const day = `${now.getDate()}`.padStart(2, 0)
    // const month = `${now.getMonth() + 1}`.padStart(2, 0)
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2, 0)
    // const min = `${now.getMinutes()}`.padStart(2, 0)

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // ADD transfer Date

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor( inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);


    // ADD transfer Date

    currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.acc.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0);



// // PARSING

// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23'));

// console.log(Number.parseInt('  2.5rem'));
// console.log(Number.parseFloat('  2.5rem'));

// console.log(Number.isNaN(23 / 0));

// // Checking if value is number (real number)
// console.log(Number.isFinite(20));

// console.log(Math.sqrt(9));

// console.log(Math.max(5,15,3,22));
// console.log(Math.max(5,15,3,22));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);


// // Random function with min and max values
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min
// console.log(randomInt(-33,100));

// // Rounding Integers
// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// // Rounding Decimals
// // toFixed returned string
// console.log((2.7).toFixed(0));

/////////////////////////// REMINDER OPERATOR

// console.log(5 % 2);

// console.log(8 % 3);
// console.log(8 / 3); // 8 = 2 * 3 + 2
// console.log(6 % 2);

// const isEven = n => n % 2  === 0

// console.log(isEven(3));

// labelBalance.addEventListener('click', function(){

//   [...document.querySelectorAll('.movements__row')].forEach(function(row, i){
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered'
//     }

//     if (i % 3 === 0){ row.style.backgroundColor = 'blue'}
//   })

// })

// 
// const diemeter = 287_360_000_000;

// console.log(diemeter);

// const priceCents = 345_99;
// console.log(priceCents);

// const transferFee = 15_00;
// const transferFee2 = 1_500;

// console.log(transferFee);
// console.log(transferFee2);

// const PI = 3.14_15
// console.log(PI);


// console.log(213465468797965465461546546546546546n);
// console.log(BigInt(213465468797965465461546546546546546));

// // Oparations

// console.log(10000n + 10000n);

////////////////// DATES AND TIMES

// Create a date - 4 ways

// const now = new Date()
// console.log(now);

// console.log(new Date('Wed Jun 05 2024 18:25:20 '));
// console.log(new Date('December 24, 2015 '));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037 , 10, 15, 23, 5, 10));

// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// const future = new Date(2037 , 10, 19, 15, 23)
// console.log(future);

// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());

// console.log(future.toISOString());

// console.log(future.getTime());

// console.log(new Date(2142249780000));

// future.setFullYear(2040)
// console.log(future);
const num = 32423423.23;

// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'EUR'
// }

// console.log('US:   ', new Intl.NumberFormat('en-US', options).format(num));
// console.log(navigator.language, new Intl.NumberFormat(navigator.language,options)).format(num);