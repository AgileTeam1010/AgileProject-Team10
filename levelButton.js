document.addEventListener('DOMContentLoaded', () => {
  const levelLinks = document.querySelectorAll('.level');

  // Gör funktionen global
  window.setActiveLevel = function (level) {
    levelLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.level[data-level="${level}"]`);
    if (activeLink) activeLink.classList.add('active');
  };

  // Läs level från URL-hash
  const params = new URLSearchParams(window.location.hash.substring(1));
  let currentLevel = params.get('level') || "1";

  window.location.hash = `level=${currentLevel}`;
  setActiveLevel(currentLevel);

  // Klick-hantering
  levelLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const level = link.dataset.level;
      setActiveLevel(level);
      if (typeof newQuestion === "function") newQuestion(level);
      window.location.hash = `level=${level}`;
    });
  });
});
