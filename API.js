let currentQuestion = null;
let currentLevel = 1;
const maxQuestionsPerLevel = 2;
const completedQuestions = { 1: [], 2: [], 3: [], 4: [], 5: [] };

// Hämta valt räknesätt från sidan (data-operator) – default '+'
function getCurrentOperator() {
  const root = document.getElementById('gameRoot');
  const op = root?.dataset?.operator || '+';
  return op; // '+' eller '÷'
}

function levelRange(level) {
  switch (level) {
    case 1: return { min: 1,   max: 10  };
    case 2: return { min: 10,  max: 50  };
    case 3: return { min: 50,  max: 200 };
    case 4: return { min: 100, max: 500 };
    case 5: return { min: 500, max: 1000 };
    default: return { min: 1, max: 10 };
  }
}

// Slumpar heltal i [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genererar en uppgift beroende på operator:
 * '+' => a + b, svar = a + b
 * '÷' => a ÷ b, svar = q  (a konstrueras som b*q så det blir heltal utan rest)
 */
function generateQuestion(level, operator) {
  const { min, max } = levelRange(level);

  // 👇 NEW: random operator if "mixed"
  if (operator === 'mixed') {
    const allOps = ['+', '−', '×', '÷'];
    operator = allOps[Math.floor(Math.random() * allOps.length)];
  }

  if (operator === '+') {
    const a = randInt(min, max);
    const b = randInt(min, max);
    return { a, b, operator: '+', answer: a + b, question: `Solve: ${a} + ${b}` };
  }

  if (operator === '−') {
    const a = randInt(min, max);
    const b = randInt(min, a);
    return { a, b, operator: '−', answer: a - b, question: `Solve: ${a} − ${b}` };
  }

  if (operator === '×') {
  // Keep numbers small at first, scale gradually with level
  let aMax, bMax;

  switch (level) {
    case 1:
      aMax = 5;  bMax = 5; break;      // 1×1 to 5×5
    case 2:
      aMax = 8;  bMax = 8; break;      // 1×1 to 8×8
    case 3:
      aMax = 10; bMax = 10; break;     // 1×1 to 10×10 (full table)
    case 4:
      aMax = 15; bMax = 12; break;     // a bit larger
    case 5:
      aMax = 20; bMax = 15; break;     // bigger but still reasonable
    default:
      aMax = 10; bMax = 10;
  }

  const a = randInt(1, aMax);
  const b = randInt(1, bMax);
  return { a, b, operator: '×', answer: a * b, question: `Solve: ${a} × ${b}` };
}

if (operator === '÷') {
  // Smaller divisor and quotient for easier, cleaner divisions
  let divisorMax, quotientMax;

  switch (level) {
    case 1:
      divisorMax = 5;  quotientMax = 10; break;   // e.g. 20 ÷ 4 = 5
    case 2:
      divisorMax = 8;  quotientMax = 15; break;
    case 3:
      divisorMax = 10; quotientMax = 25; break;
    case 4:
      divisorMax = 12; quotientMax = 40; break;
    case 5:
      divisorMax = 15; quotientMax = 50; break;
    default:
      divisorMax = 10; quotientMax = 20;
  }

  const b = randInt(2, divisorMax);   // divisor
  const q = randInt(2, quotientMax);  // quotient
  const a = b * q;                    // dividend (always clean division)

  return { a, b, operator: '÷', answer: q, question: `Solve: ${a} ÷ ${b}` };
}


  // fallback
  const a = randInt(min, max);
  const b = randInt(min, max);
  return { a, b, operator: '+', answer: a + b, question: `Solve: ${a} + ${b}` };
}

function newQuestion() {
  const operator = getCurrentOperator();
  currentQuestion = generateQuestion(currentLevel, operator);
  document.getElementById('question').textContent = currentQuestion.question;

  // Visa uppgiften
  /*
  document.querySelector('.first').textContent = currentQuestion.a;
  document.querySelector('.second .number').textContent = currentQuestion.b;
  document.querySelector('.second .plus').textContent = currentQuestion.operator;*/


  // Shared logic
  const firstEl = document.querySelector('.first');
  const secondEl = document.querySelector('.second');

  // Update number display depending on layout
  if (operator === '÷') {
    // Vertical division layout
    firstEl.textContent = currentQuestion.a; // dividend (top)
    secondEl.textContent = currentQuestion.b; // divisor (bottom)
  } else {
    // For +, −, ×, keep using your existing nested structure
    firstEl.textContent = currentQuestion.a;
    const numEl = secondEl.querySelector('.number');
    const opEl = secondEl.querySelector('.plus');
    if (numEl) numEl.textContent = currentQuestion.b;
    if (opEl) opEl.textContent = currentQuestion.operator;
  }

  document.getElementById('userAnswer').value = '';
  document.getElementById('feedback').textContent = "Let's catculate"
}

function updateLevelButtons() {
  document.querySelectorAll('.level').forEach(link => {
    const level = parseInt(link.dataset.level);
    link.textContent = `Level ${level}`;

    // Lås upp logik
    if (level === 1) {
      if (completedQuestions[1].length >= maxQuestionsPerLevel) {
        link.classList.add('locked-level');
        link.textContent += ' ✔️';
      } else {
        link.classList.remove('locked-level');
      }
      return;
    }

    if (
      completedQuestions[level - 1] &&
      completedQuestions[level - 1].length >= maxQuestionsPerLevel &&
      completedQuestions[level].length < maxQuestionsPerLevel
    ) {
      link.classList.remove('locked-level');
    } else {
      link.classList.add('locked-level');
    }

    if (completedQuestions[level].length >= maxQuestionsPerLevel) {
      link.textContent += ' ✔️';
    }
  });
}

function checkAnswer() {
  const userAnswerRaw = document.getElementById('userAnswer').value.trim();
  if (!userAnswerRaw) {
    document.getElementById('feedback').textContent = 'Type an answer first!';
    return;
  }

  // Heltalssvar (division är konstruerad så att svaret är heltal)
  const userAnswer = parseInt(userAnswerRaw, 10);
  const isCorrect = userAnswer === currentQuestion.answer;

  if (isCorrect) {
  
    completedQuestions[currentLevel].push({
      question: currentQuestion.question,
      answer: currentQuestion.answer
    });

    

    if (completedQuestions[currentLevel].length >= maxQuestionsPerLevel) {
      updateLevelButtons();
      updateProgressDisplay();
      document.getElementById('feedback').textContent = 'Purrfect!';
      
      if (currentLevel < 5) {
        currentLevel++;
        document.getElementById('feedback').textContent = `Continue to level ${currentLevel}`;
        setTimeout(() => {
          newQuestion();
          updateProgressDisplay();

          // Uppdatera färgmarkeringen i sidebaren
          if (typeof window.setActiveLevel === "function") {
            window.setActiveLevel(currentLevel);
          } 
           // Uppdatera URL-hash (valfritt)
          window.location.hash = `level=${currentLevel}`;

        }, 1200);
      }
      return;
    }

    newQuestion();
    updateLevelButtons();
    updateProgressDisplay();
  } 
  if(isCorrect){
    document.getElementById('feedback').textContent = 'Purrfect!';
  }
  else {
    document.getElementById('feedback').textContent = 'Try again!';
  }
}

function updateProgressDisplay() {
  const completed = completedQuestions[currentLevel].length;
  const star = completed >= maxQuestionsPerLevel ? '⭐' : '';
  document.getElementById('progressDisplay').textContent =
    `Level ${currentLevel}: ${completed}/${maxQuestionsPerLevel} ${star}`;
}

// Init: koppla level-knappar och progress
document.addEventListener('DOMContentLoaded', () => {
  // Läs level från URL-hash (?level=X)
  const params = new URLSearchParams(window.location.hash.replace('#', ''));
  const levelParam = parseInt(params.get('level'), 10);
  if (!Number.isNaN(levelParam) && levelParam >= 1 && levelParam <= 5) {
    currentLevel = levelParam;
  }

  document.querySelectorAll('.level').forEach(link => {
    link.addEventListener('click', (e) => {
      const selectedLevel = parseInt(link.dataset.level, 10);
      if (link.classList.contains('locked-level')) {
        e.preventDefault();
        return;
      }
      currentLevel = selectedLevel;
      //document.getElementById('feedback').textContent = `Level ${currentLevel}`;
      updateProgressDisplay();
      newQuestion();

    });
  });

  updateLevelButtons();
  updateProgressDisplay();
  document.getElementById('feedback').textContent = "Let's get started!";

});
