import { Book } from "../js/book.js";
import { BookList } from "../js/booklist.js";

describe('BookList Core Functionality', () => {
    let myBookList;
    let book1, book2;

    beforeEach(() => {
        // 1. Inicializa libros
        book1 = new Book('Cien años de soledad', 'Realismo Mágico', 'García Márquez');
        book2 = new Book('El Principito', 'Ficción', 'Saint-Exupéry');
        
        // 2. Inicializa la lista
        myBookList = new BookList();
    });

    test('should initialize with correct properties', () => {
        expect(myBookList.books.length).toBe(0);
        expect(myBookList.readCount).toBe(0);
        expect(myBookList.currentBook).toBe(null);
    });

    test('should correctly add a book and set the currentBook', () => {
        myBookList.add(book1);
        expect(myBookList.books.length).toBe(1);
        expect(myBookList.currentBook).toBe(book1);
    });
});