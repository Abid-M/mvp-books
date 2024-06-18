// Parse the book ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Function to fetch book details based on bookId
async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`./data/books.json`);
        const bookData = await response.json();

        const book = bookData.find(book => book.title === bookId);

        if (book) {
            // Populate book details on the page. Used BOOTSTRAP instead
            document.getElementById('book-cover').src = book.image_url;
            document.getElementById('book-title').textContent = book.title;
            document.getElementById('book-author').textContent = `Author: ${book.author}`;
            document.getElementById('book-blurb').textContent = book.blurb;
            document.getElementById('book-published').textContent = `Published: ${book.published_date}`;
            document.getElementById('book-categories').textContent = `Categories: ${book.categories.join(', ')}`;
        } else {
            console.error('Book not found');
        }
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

// Fetch book details when the page loads
fetchBookDetails(bookId);
