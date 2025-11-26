import { Book } from "./book.js";
import { BookList } from "./booklist.js";

/**
 * Función principal que inicializa la aplicación y configura los eventos del DOM.
 */
const main = () => {
    // Inicializo la lista de libros (Modelo)
    const myBookList = new BookList();

    // Referencias al DOM (fallarían en Jest sin JSDOM y sin el aislamiento)
    const listElement = document.getElementById("lista-lectura");
    const countElement = document.getElementById("contador-libros");

    /**
     * Función para renderizar la interfaz.
     */
    function render() {
        if (!listElement || !countElement) return;

        // Limpio la lista actual
        listElement.innerHTML = "";

        // Recorro los libros y genero el HTML
        myBookList.books.forEach((book) => {
            const li = document.createElement("li");
            li.className = "item-libro";

            let statusHtml = "";
            if (book.read) {
                const options = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                const dateStr = book.readDate.toLocaleDateString("es-ES", options);
                statusHtml = `<span class="estado-leido">Leído el ${dateStr}</span>`;
            } else {
                statusHtml = `<span class="estado-no-leido">No leído</span>`;
            }

            li.innerHTML = `
                <div class="info-libro">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </div>
                <div class="estado-libro">
                    ${statusHtml}
                </div>
            `;

            // Añadir botón "Marcar como leído"
            if (book === myBookList.currentBook && !book.read) {
                const btn = document.createElement("button");
                btn.className = "btn-marcar-leido";
                btn.textContent = "Marcar como leído";

                btn.onclick = () => {
                    myBookList.finishCurrentBook();
                    render(); // Refrescar la vista
                };

                li.querySelector(".estado-libro").appendChild(btn);
            }

            listElement.appendChild(li);
        });

        // Actualizar contador
        countElement.textContent = `Libros leídos: ${myBookList.readCount} de ${myBookList.books.length}`;
    }

    // Event Listener para el botón "Añadir Libro"
    const btnAnadir = document.getElementById("btn-anadir-libro");
    if (btnAnadir) {
        btnAnadir.addEventListener("click", () => {
            const titleInput = document.getElementById("titulo");
            const authorInput = document.getElementById("autor");
            const genreInput = document.getElementById("genero");

            const title = titleInput.value.trim();
            const author = authorInput.value.trim();
            const genre = genreInput.value.trim();

            if (title && author && genre) {
                const newBook = new Book(title, genre, author);
                myBookList.add(newBook);
                render();
                
                // Limpiar campos
                titleInput.value = "";
                authorInput.value = "";
                genreInput.value = "";
            } else {
                alert("Por favor, rellena todos los campos");
            }
        });
    }
}

// --- AISLAMIENTO CRÍTICO PARA JEST (FASE CI) ---
// Solo ejecuta la inicialización del DOM si el objeto 'document' existe (en el navegador).
// En Jest/Node.js, esto se salta, previniendo el error 'ReferenceError: document is not defined'
// que veíamos en los errores previos.
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", main);
}