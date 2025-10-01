let currentEquation = "";
let correctAnswer = 0;
let currentLevel = 1;

//Function to generate a new question/Equation
async function newQuestion() {                                                        // Lägg till så att man kan inputta operator
  
  // Generate random numbers and an operator
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let operators = ["+"]; // Only addition for now
  let operator = operators[Math.floor(Math.random() * operators.length)];             // randomly selects an operator from the array above, but only addition for now

  currentEquation = `${num1} ${operator} ${num2}`;                                    // random equation with an operator, can be extended with more operators above

  // Use Math.js API to evaluate
  let url = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(currentEquation)}`; // linking the API to the script here, and saves the equation in the URL
  let response = await fetch(url);                                                    // checks with the API if the equation is correct by sedning the URL to the API
  correctAnswer = await response.text();                                              // the correct answer is replied and gets stored here

  document.getElementById("question").textContent = `Solve: ${currentEquation}`;      // displays the equation to the user
  document.getElementById("userAnswer").value = "";                                   // user input 
  document.getElementById("feedback").textContent = "";                               // feedback, correct or wrong
}

// Generate a question based on the current level
function generateQuestion(level) {
  let min, max;
  switch (level) {
    case 1: min = 1; max = 10; break;
    case 2: min = 10; max = 50; break;
    case 3: min = 50; max = 200; break;
    case 4: min = 100; max = 500; break;
    case 5: min = 500; max = 1000; break;
    default: min = 1; max = 10;
  }
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return { question: `${a} + ${b}`, answer: a + b };
}

function newQuestion() {
  currentQuestion = generateQuestion(currentLevel);
  document.getElementById('question').textContent = currentQuestion.question;
  document.getElementById('feedback').textContent = '';
  document.getElementById('userAnswer').value = '';
}

function checkAnswer() {
  const userAnswer = document.getElementById('userAnswer').value.trim();
  const isCorrect = parseInt(userAnswer, 10) === currentQuestion.answer;

  if (isCorrect) {
    document.getElementById('feedback').textContent = 'Correct!';
  } else {
    document.getElementById('feedback').textContent = 'Try again!';
  }
}

// Add event listeners for level buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.level').forEach(link => {
    link.addEventListener('click', () => {
      currentLevel = parseInt(link.dataset.level); // takes the level from the a-ref clicked
      newQuestion();
    });
  });
});
