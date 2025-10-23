let currentQuestion = null;
let currentLevel = 1;
const maxQuestionsPerLevel = 2;
const completedQuestions = { 1: [], 2: [], 3: [], 4: [], 5: [] };

// Get selected operator from the page
function getCurrentOperator() {
  const root = document.getElementById('gameRoot');
  const op = root?.dataset?.operator || '+';
  return op;
}

function levelRange(level) {
  switch (level) {
    case 1: return { min: 1, max: 10 };
    case 2: return { min: 10, max: 50 };
    case 3: return { min: 50, max: 200 };
    case 4: return { min: 100, max: 500 };
    case 5: return { min: 500, max: 1000 };
    default: return { min: 1, max: 10 };
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(level, operator) {
  const { min, max } = levelRange(level);

  if (operator === 'mixed') {
    const allOps = ['+', '−', '×', '÷'];
    operator = allOps[Math.floor(Math.random() * allOps.length)];
  }

  if (operator === '+') {
    const a = randInt(min, max);
    const b = randInt(min, max);
    return { a, b, operator: '+', answer: a + b, question: `${a} + ${b}` };
  }

  if (operator === '−') {
    const a = randInt(min, max);
    const b = randInt(min, a);
    return { a, b, operator: '−', answer: a - b, question: `${a} − ${b}` };
  }

  if (operator === '×') {
    let aMax, bMax;
    switch (level) {
      case 1: aMax = 5; bMax = 5; break;
      case 2: aMax = 8; bMax = 8; break;
      case 3: aMax = 10; bMax = 10; break;
      case 4: aMax = 15; bMax = 12; break;
      case 5: aMax = 20; bMax = 15; break;
      default: aMax = 10; bMax = 10;
    }
    const a = randInt(1, aMax);
    const b = randInt(1, bMax);
    return { a, b, operator: '×', answer: a * b, question: `${a} × ${b}` };
  }

  if (operator === '÷') {
    let divisorMax, quotientMax;
    switch (level) {
      case 1: divisorMax = 5; quotientMax = 10; break;
      case 2: divisorMax = 8; quotientMax = 15; break;
      case 3: divisorMax = 10; quotientMax = 25; break;
      case 4: divisorMax = 12; quotientMax = 40; break;
      case 5: divisorMax = 15; quotientMax = 50; break;
      default: divisorMax = 10; quotientMax = 20;
    }

    const b = randInt(2, divisorMax);
    const q = randInt(2, quotientMax);
    const a = b * q;
    return { a, b, operator: '÷', answer: q, question: `${a} ÷ ${b}` };
  }

  // fallback
  const a = randInt(min, max);
  const b = randInt(min, max);
  return { a, b, operator: '+', answer: a + b, question: `${a} + ${b}` };
}

function getTopicName(operator) {
  switch (operator) {
    case '+': return 'addition';
    case '−': return 'subtraction';
    case '×': return 'multiplication';
    case '÷': return 'division';
    case 'mixed': return 'mixed';
    default: return 'unknown';
  }
}

// 🔥 Save progress directly to Firestore
async function saveProgress(level, operator) {
  try {
    const auth = window._auth;
    const db = window._db;
    const doc = window._doc;
    const getDoc = window._getDoc;
    const setDoc = window._setDoc;
    const updateDoc = window._updateDoc;

    if (!auth?.currentUser) {
      console.warn("No user signed in – progress not saved.");
      return;
    }

    const uid = auth.currentUser.uid;
    const topic = getTopicName(operator);
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    const existing = snap.exists() ? snap.data() : { progress: {} };
    const current = existing.progress?.[topic] || { answeredCount: 0, highestLevel: 1 };

    const updatedTopic = {
      answeredCount: current.answeredCount + 1,
      highestLevel: Math.max(current.highestLevel, level)
    };

    const updatedProgress = { ...existing.progress, [topic]: updatedTopic };

    if (snap.exists()) {
      await updateDoc(userRef, { progress: updatedProgress });
    } else {
      await setDoc(userRef, { progress: updatedProgress });
    }

    console.log(`✅ Firestore updated for ${topic}:`, updatedTopic);

  } catch (err) {
    console.error("❌ Failed to save progress:", err);
  }
}


function newQuestion() {
  const operator = getCurrentOperator();
  currentQuestion = generateQuestion(currentLevel, operator);
  document.getElementById('question').textContent = currentQuestion.question;

  const firstEl = document.querySelector('.first');
  const secondEl = document.querySelector('.second');

  if (operator === '÷') {
    firstEl.textContent = currentQuestion.a;
    secondEl.textContent = currentQuestion.b;
  } else {
    firstEl.textContent = currentQuestion.a;
    const numEl = secondEl.querySelector('.number');
    const opEl = secondEl.querySelector('.plus');
    if (numEl) numEl.textContent = currentQuestion.b;
    if (opEl) opEl.textContent = currentQuestion.operator;
  }

  document.getElementById('userAnswer').value = '';
  document.getElementById('feedback').textContent = "Let's catculate";
}

function updateLevelButtons() {
  document.querySelectorAll('.level').forEach(link => {
    const level = parseInt(link.dataset.level);
    link.textContent = `Level ${level}`;

    if (level === 1) {
      if (completedQuestions[1].length >= maxQuestionsPerLevel) {
        link.classList.add('locked-level');
        link.textContent += ' ✔️';
      } else link.classList.remove('locked-level');
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

async function checkAnswer() {
  const userAnswerRaw = document.getElementById('userAnswer').value.trim();
  if (!userAnswerRaw) {
    document.getElementById('feedback').textContent = 'Type an answer first!';
    return;
  }

  const userAnswer = parseInt(userAnswerRaw, 10);
  const isCorrect = userAnswer === currentQuestion.answer;

  if (isCorrect) {
    completedQuestions[currentLevel].push({
      question: currentQuestion.question,
      answer: currentQuestion.answer
    });

    const operator = getCurrentOperator();
    await saveProgress(currentLevel, operator);

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
          if (typeof window.setActiveLevel === "function") {
            window.setActiveLevel(currentLevel);
          }
          window.location.hash = `level=${currentLevel}`;
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

document.addEventListener('DOMContentLoaded', () => {
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
  document.getElementById('feedback').textContent = "Let's get started!";
});
