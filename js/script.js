const resultsPerPage = 10; // Number of results to display per page
let currentPage = 0; // Current page index

function searchBooks() {
  const query = document.getElementById("searchInput").value;
  const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.docs);
      updatePagination(data.num_found);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayResults(books) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const startIndex = currentPage * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const displayedBooks = books.slice(startIndex, endIndex);

  displayedBooks.forEach((book, index) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "book";
    bookDiv.innerHTML = `
      <h5><a href="book_details.html?isbn=${encodeURIComponent(
        book.isbn[0]
      )}">${book.title}</a></h5>
      <p>Author(s): ${
        book.author_name ? book.author_name.join(", ") : "N/A"
      }</p>
      <p>First Published: ${book.first_publish_year || "N/A"}</p>
    `;

    resultsDiv.appendChild(bookDiv);
  });

  // Center-align the results
  resultsDiv.style.display = "flex";
  resultsDiv.style.flexDirection = "column";
  resultsDiv.style.alignItems = "center";
  resultsDiv.style.marginTop = "20px"; // Adjust as needed
}

function updatePagination(totalResults) {
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  prevPageBtn.style.display = currentPage === 0 ? "none" : "block";
  nextPageBtn.style.display = currentPage === totalPages - 1 ? "none" : "block";

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      searchBooks();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      searchBooks();
    }
  });
}

// Call searchBooks() when search button is clicked
document.getElementById("searchButton").addEventListener("click", searchBooks);
