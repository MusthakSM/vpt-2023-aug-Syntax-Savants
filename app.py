from flask import Flask, render_template, request
import requests
import json
import math

app = Flask(__name__)

# Global variables to store fetched book data and search query
books_data = []
search_query = ""

@app.route('/', methods=['GET', 'POST'])
def index():
    global books_data, search_query  # Access the global variables
    
    books_per_page = 5  # Define the number of books to display per page
    
    if request.method == 'POST':
        search_query = request.form.get('search')
        if search_query:
            books_data = search_books(search_query)
    
    books = books_data  # Use the stored book data
    total_pages = calculate_total_pages(books)
    current_page = int(request.args.get('page', 1))
    start_index = (current_page - 1) * books_per_page
    end_index = start_index + books_per_page
    paginated_books = books[start_index:end_index]
    
    return render_template('index.html', paginated_books=paginated_books, total_pages=total_pages, current_page=current_page, search_query=search_query)

@app.route('/more-info/<int:book_index>')
def more_info(book_index):
    global books_data  # Access the global variable
    
    selected_book = books_data[book_index]  # Get the selected book based on the index
    return render_template('MoreInfo.html', book=selected_book)


def calculate_total_pages(books):
    # Calculate total number of pages based on the number of books retrieved
    # and the number of books per page you want to display
    books_per_page = 5  # Update this based on your preference
    total_books = len(books)
    total_pages = math.ceil(total_books / books_per_page)
    return total_pages

def search_books(query):
    url = f'http://openlibrary.org/search.json?q={query}'
    response = requests.get(url)
    print(response.status_code)  # Add this line to check the status code
    data = json.loads(response.text)
    books = data.get('docs', [])
    print(books)  # Add this line to check the retrieved books
    return books

if __name__ == '__main__':
    app.run(debug=True)
