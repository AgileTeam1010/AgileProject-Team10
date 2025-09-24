let currentEquation = "";
let correctAnswer = 0;

//Function to generate a new question/Equation
async function newQuestion() {

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

function checkAnswer() { 
  let userAnswer = document.getElementById("userAnswer").value.trim();                // gets the user input and trims any extra spaces

  if (userAnswer === correctAnswer) {
    document.getElementById("feedback").textContent = "Correct!"; 
  } else {
    document.getElementById("feedback").textContent = `Wrong! Correct answer was: ${correctAnswer}`;
  }
}
