document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('siteSearch');
  const searchIcon = document.querySelector('.search-icon');

  // Global topics array
  const topics = [
  { name: "Addition",  url: "/addition/addition.html" },
  { name: "Subtraction", url: "/subtraction/subtraction.html" },
  { name: "Multiplication", url: "/multiplication/multiplication.html" },
  { name: "Division", url: "/Division/division.html" },
  { name: "Mixed", url: "/mixed/mixed.html" }
];

  // Function to redirect to the first matching topic
  function redirectToMatch() {
    const query = searchInput.value.trim().toLowerCase();
    const match = topics.find(topic => topic.name.toLowerCase().includes(query));

    if (match) {
      window.location.href = match.url; // redirect to page
    } else {
      alert('No matching topic found!');
    }
  }

  // Enter key triggers search
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') redirectToMatch();
  });

  // Clicking the search icon triggers search
  searchIcon.addEventListener('click', redirectToMatch);
});
