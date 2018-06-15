// Questions array
const questions = [
  { question: 'Enter your first name' },
  { question: 'Enter your last name' },
  { question: 'Enter your email', pattern: /\S+@\S+\.\S+/ },
  { question: 'Enter your password', type: 'password' }
];

// Transition times
const shakeTime = 70; // Shake transition time
const switchTime = 200; // Transition between questions

// Init position at first question
let position = 0;

let data = {};

// Init DOM elements
const formBox = document.querySelector('#form-box');
const nextBtn = document.querySelector('#next-btn');
const prevBtn = document.querySelector('#prev-btn');
const inputGroup = document.querySelector('#input-group');
const inputField = document.querySelector('#input-field');
const inputLabel = document.querySelector('#input-label');
const inputProgress = document.querySelector('#input-progress');
const progressBar = document.querySelector('#progress-bar');

// Events
document.addEventListener('DOMContentLoaded', getQuestion);
nextBtn.addEventListener('click', validate);
inputField.addEventListener('keyup', e => {
  if(e.keyCode == 13) {
    validate();
  }
});

// Functions
// Get question from array and add to markup
function getQuestion() {
  // Get the current question
  inputLabel.innerHTML = questions[position].question;
  // Get current type
  inputField.type = questions[position].type || 'text';
  // Get current answer
  inputField.value = questions[position].answer || '';
  // Focus on element
  inputField.focus();

  // Set progress bar width - variable to the questions length
  progressBar.style.width = (position * 100) / questions.length + '%';

  // Add user icon or back arrow depending on question
  prevBtn.className = position ? 'fas fa-arrow-left' : 'fas fa-user';

  showQuestion();
}

// Display question
function showQuestion() {
  inputGroup.style.opacity = 1;
  inputProgress.style.transition = '';
  inputProgress.style.width = '100%';
}

// Hide question
function hideQuestion() {
  inputGroup.style.opacity = 0;
  inputProgress.style.marginLeft = 0;
  inputProgress.style.width = 0;
  inputProgress.style.transition = 'none';
  inputGroup.style.border = null;
}

// Transform to create to shake motion
function transform(x, y) {
  formBox.style.transform = `translate(${x}px, ${y}px)`;
}

// Validate question
function validate() {
  if(!inputField.value.match(questions[position].pattern || /.+/)) {
    inputFail();
  } else {
    inputPass();
  }
}

// Input Fail
function inputFail() {
  formBox.className = 'error';
  // Repeat shake motion using for loop
  for (let i = 0; i < 6; i++) {
    setTimeout(transform, shakeTime * i, ((i % 2) * 2 - 1) * 20, 0);
    setTimeout(transform, shakeTime * 6, 0, 0);
    inputField.focus();
  }
}

// Input Pass
function inputPass() {
  formBox.className = '';
  setTimeout(transform, shakeTime * 0, 0, 10);
  setTimeout(transform, shakeTime * 1, 0, 0);

  switch (position) {
    case 0:
      data.firstName = inputField.value;
      break;

    case 1:
      data.lastName = inputField.value;
      break;
    
    case 2:
      data.email = inputField.value;
      break;

    case 3:
      data.password = btoa(inputField.value);
      break;
  
    default:
      break;
  }

  // Increment position
  position++;

  // if new question, hide current and get next
  if (questions[position]) {
    hideQuestion();
    getQuestion();
  } else {
    // Remove if no more questions
    hideQuestion();
    formBox.className = 'close';
    progressBar.style.width = '100%';

    formComplete();
  }
}

function formComplete() {
  console.log(JSON.stringify(data));
}