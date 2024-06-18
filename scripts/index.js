// Global variables for storing original book data and people data
let originalBookData = [];
let peopleData = [];

// Function to fetch books data from JSON file
async function fetchBooksData() {
    try {
        const response = await fetch('./data/books.json');
        originalBookData = await response.json();
    } catch (error) {
        console.error('Error fetching books data:', error);
        originalBookData = []; // Set originalBookData to empty array on error
    }
}

// Function to fetch people data from JSON file
async function fetchPeopleData() {
    try {
        const response = await fetch('./data/people.json');
        peopleData = await response.json();
    } catch (error) {
        console.error('Error fetching people data:', error);
        peopleData = []; // Set peopleData to empty array on error
    }
}

// Function to create book item HTML element
function createBookItem(book) {
    const bookItem = document.createElement('li');
    bookItem.className = "book-item";

    // Create anchor tag for each book item
    const anchor = document.createElement('a');
    anchor.href = `book-details.html?id=${book.title}`; 
    anchor.style.color = 'inherit';

    const title = document.createElement('h2');
    title.textContent = book.title;
    anchor.appendChild(title);
    bookItem.appendChild(anchor);

    const author = document.createElement('p');
    author.textContent = `Author: ${book.author}`;
    bookItem.appendChild(author);

    const categories = document.createElement('p');
    categories.textContent = `Categories: ${book.categories.join(', ')}`;
    bookItem.appendChild(categories);

    const image = document.createElement('img');
    image.src = book.image_url;
    image.alt = book.title;
    bookItem.appendChild(image);

    const loanedBy = document.createElement('p');
    if (book.loaned_by_id) {
        const person = findPersonById(book.loaned_by_id);
        loanedBy.textContent = person ? `Loaned by: ${person.first_name} ${person.last_name}` : 'Available to loan';
        loanedBy.classList.add(person ? 'loaned' : 'available');
    } else {
        loanedBy.textContent = 'Available to loan';
        loanedBy.classList.add('available');
    }
    bookItem.appendChild(loanedBy);

    return bookItem;
}

// Function to find person by ID in people data
function findPersonById(id) {
    return peopleData.find(person => person.id === id);
}

// Function to render books list based on filters
function renderBooksList(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear existing list

    books.forEach(book => {
        const bookItem = createBookItem(book);
        bookList.appendChild(bookItem);
    });
}

// Function to populate category filter options
function populateCategoryFilterOptions(books) {
    const categoryFilter = document.getElementById('category-filter');
    const categories = new Set(); // ONLY UNIQUE CATEGORIES
    books.forEach(book => {
        book.categories.forEach(category => categories.add(category));
    });
    categories.forEach(category => {
        const option = document.createElement('option');
        option.textContent = category;
        option.value = category;
        categoryFilter.appendChild(option);
    });
}

// Function to handle filter changes
function handleFiltersChange() {
    const categoryFilterValue = document.getElementById('category-filter').value;
    const availabilityFilterValue = document.getElementById('availability-filter').value;

    let filteredBooks = [...originalBookData]; // Just duplicating array to another variable

    // Apply category filter
    if (categoryFilterValue) {
        filteredBooks = filteredBooks.filter(book => book.categories.includes(categoryFilterValue));
    }

    // Apply availability filter
    if (availabilityFilterValue === 'available') {
        filteredBooks = filteredBooks.filter(book => !book.loaned_by_id);
    } else if (availabilityFilterValue === 'loaned') {
        filteredBooks = filteredBooks.filter(book => book.loaned_by_id);
    }

    // Render filtered books list
    renderBooksList(filteredBooks);
}

// Initialise the page
async function initialisePage() {
    await fetchBooksData();
    await fetchPeopleData();
    renderBooksList(originalBookData);
    populateCategoryFilterOptions(originalBookData);

    // Add event listeners for filter changes
    document.getElementById('category-filter').addEventListener('change', handleFiltersChange);
    document.getElementById('availability-filter').addEventListener('change', handleFiltersChange);
}

// Start initialisation when page loads
document.addEventListener("DOMContentLoaded", initialisePage);
