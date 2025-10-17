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

      // --- NEW: save progress for this operator if helper exists ---
      if (typeof window._saveProgress === 'function') {
        const op = getCurrentOperator();
        const map = completedCountsMap(); // counts for current operator across levels
        // save only the counts for the operator (Firestore helper merges)
        window._saveProgress(op, map).catch(err => console.warn('Save failed', err));
      }

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

// --- NEW helper: create a map counts per level from completedQuestions ---
function completedCountsMap() {
  const map = {};
  for (let lvl = 1; lvl <= 5; lvl++) {
    map[String(lvl)] = (completedQuestions[lvl] || []).length;
  }
  return map;
}

// --- NEW: apply loaded progress (object from firestore) to completedQuestions ---
function applyLoadedProgressForOperator(operatorKey, savedMap) {
  if (!savedMap) return;
  for (let lvl = 1; lvl <= 5; lvl++) {
    const count = savedMap[String(lvl)] || 0;
    // create placeholder items so existing UI logic (length checks) works
    completedQuestions[lvl] = [];
    for (let i = 0; i < count && i < maxQuestionsPerLevel; i++) {
      completedQuestions[lvl].push({ question: 'saved', answer: null });
    }
  }
}

// Init: koppla level-knappar och progress
document.addEventListener('DOMContentLoaded', async () => {
  // Läs level från URL-hash (?level=X)
  const params = new URLSearchParams(window.location.hash.replace('#', ''));
  const levelParam = parseInt(params.get('level'), 10);
  if (!Number.isNaN(levelParam) && levelParam >= 1 && levelParam <= 5) {
    currentLevel = levelParam;
  }

  // --- NEW: attempt to load saved progress (if firebase-init exposed window._loadProgress) ---
  if (typeof window._loadProgress === 'function') {
    try {
      const saved = await window._loadProgress(); // returns map by operator
      const op = getCurrentOperator(); // e.g. '+', '−', '×', '÷', 'mixed'
      if (saved && saved[op]) {
        applyLoadedProgressForOperator(op, saved[op]);
      }
    } catch (err) {
      console.warn('Could not load saved progress', err);
    }
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
