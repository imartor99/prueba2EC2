# Proyecto de Despliegue Continuo - Lista de Libros

Este proyecto implementa una aplicación simple para gestionar una lista de lectura, configurada para Integración Continua (CI) y Despliegue Continuo (CD).

## 🚀 Estructura del Proyecto

* **`js/book.js`**: Define la clase `Book`.
* **`js/booklist.js`**: Define la clase `BookList` y su lógica de gestión.
* **`js/main6.js`**: Contiene la lógica de inicialización y manipulación del DOM (aislada para el CI).
* **`__tests__/booklist.test.js`**: Contiene las pruebas unitarias de la lógica de `BookList`.

## ✅ Configuración del CI

Las pruebas unitarias se ejecutan con **Jest**, configurado para:
1.  Utilizar **Módulos ES (ESM)** a través del script en `package.json`.
2.  Simular el entorno del navegador (**JSDOM**) para que el código DOM pueda ser ignorado correctamente sin errores.

## ⚙️ Despliegue Continuo (CD)

El despliegue se realiza automáticamente a una instancia **AWS EC2** tras superar exitosamente las pruebas unitarias en la rama `develop`.