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
    const a = randInt(min, max);
    const b = randInt(min, max);
    return { a, b, operator: '×', answer: a * b, question: `Solve: ${a} × ${b}` };
  }

  if (operator === '÷') {
    const b = randInt(Math.max(1, Math.min(10, min)), Math.max(10, Math.min(12, max)));
    const q = randInt(min, max);
    const a = b * q;
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

  // Visa uppgiften
  document.getElementById('question').textContent = currentQuestion.question;
  document.querySelector('.first').textContent = currentQuestion.a;
  document.querySelector('.second .number').textContent = currentQuestion.b;
  document.querySelector('.second .plus').textContent = currentQuestion.operator;

  document.getElementById('userAnswer').value = '';
  document.getElementById('feedback').textContent = '';
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

    document.getElementById('feedback').textContent = 'Purrfect!';

    if (completedQuestions[currentLevel].length >= maxQuestionsPerLevel) {
      updateLevelButtons();
      updateProgressDisplay();

      if (currentLevel < 5) {
        currentLevel++;
        setTimeout(() => {
          document.getElementById('feedback').textContent = '';
          newQuestion();
          updateProgressDisplay();
        }, 1200);
      }
      return;
    }

    newQuestion();
    updateLevelButtons();
    updateProgressDisplay();
  } else {
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
      updateProgressDisplay();
      newQuestion();
    });
  });

  updateLevelButtons();
  updateProgressDisplay();
});
