document.addEventListener('DOMContentLoaded', () => {
  const levelLinks = document.querySelectorAll('.level');

  // Funktion för att markera rätt knapp
  function setActiveLevel(level) {
    levelLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.level[data-level="${level}"]`);
    if (activeLink) activeLink.classList.add('active');
  }

  // Läs level från URL-hash vid första laddning
  const params = new URLSearchParams(window.location.hash.substring(1));
  let currentLevel = params.get('level');

  // 🔹 Om ingen level finns i URL, starta på Level 1
  if (!currentLevel) {
    currentLevel = "1";
    window.location.hash = `level=1`;
  }

  // Markera aktiv level
  setActiveLevel(currentLevel);

  // Lyssna på klick på alla level-länkar
  levelLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault(); // förhindra att sidan hoppar
      const level = link.dataset.level;
      setActiveLevel(level);

      // Kör din funktion för att ladda nya uppgifter
      if (typeof newQuestion === "function") newQuestion(level);

      // Uppdatera hash i URL
      window.location.hash = `level=${level}`;
    });
  });
});

