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

# 📚 Guía de Estudio y Referencia: Implementación CI/CD (ESM + JSDOM + AWS EC2)

Este documento detalla el proceso completo de configuración de un pipeline de **Integración Continua (CI)** y **Despliegue Continuo (CD)** para una aplicación JavaScript que utiliza módulos ES (ESM) y manipulación del DOM.

---

## 1. ⚙️ Setup Inicial y Configuración Crítica (CI)

Esta sección cubre la inicialización del proyecto y las soluciones clave para que Jest funcione correctamente en el entorno de servidor (Node.js/CI).

---

### 📥 Comandos de Inicialización

| Comando | Propósito |
|---------|----------|
| `git init` | Inicializa el repositorio Git local |
| `npm init -y` | Crea el archivo `package.json` por defecto |
| `npm install jest jsdoc jest-environment-jsdom --save-dev` | Instala dependencias principales |
| `mkdir js __tests__` | Crea carpetas de código fuente y tests |
| `git checkout -b develop` | Crea la rama de desarrollo principal |

---

### 📄 Archivo Clave: `package.json` (Solución ESM y JSDOM)

```json
{
  "type": "module",
  "scripts": {
    "test": "jest",
    "docs": "jsdoc -c jsdoc.json"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "testMatch": [
      "**/__tests__/**/*.test.js"
    ]
  }
}
```

---

### ✅ Fix Crítico

| Fix | Explicación |
|-----|-------------|
| `"type": "module"` | Activa ES Modules (import/export) |
| `"test": "jest"` | Simplifica ejecución en CI |
| `"testEnvironment": "jsdom"` | Proporciona entorno `document` |

---

## 2. 🛡️ Aislamiento del Código DOM (js/main6.js)

Aunque usamos JSDOM, el código que usa `document` debe estar protegido para que Jest no falle durante el `import`.

```js
// js/main6.js

// --- CLÁUSULA DE AISLAMIENTO ---
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", main);
}
```

---

## 3. 🚨 Solución de Errores de CI (GitHub Actions)

---

### ❌ Error 1: No se encuentran tests

> `No tests found, exiting with code 1`

✅ **Solución**

```bash
touch __tests__/booklist.test.js
```

---

### ❌ Error 2: Error de configuración JSDoc

> `Cannot parse file jsdoc.json (ENOENT)`

✅ **Solución**

```bash
touch jsdoc.json
```

---

### ❌ Error 3: Error de plantilla Minami

> `Cannot find module 'node_modules/minami/publish'`

✅ **Solución**

Eliminar del archivo `jsdoc.json`:

```json
"template": "node_modules/minami"
```

---

## 4. 🌐 Despliegue Continuo (CD) en AWS EC2

---

### 🖥️ A. Preparación del servidor EC2

Acceso por SSH  
Usuario: `ubuntu`  
Directorio web: `/var/www/html/`

```bash
sudo apt update
sudo apt install apache2 rsync -y
sudo chown -R ubuntu:www-data /var/www/html
sudo systemctl restart apache2
```

---

### 🔐 B. Configuración de Secrets en GitHub

Secrets necesarios:

| Secret | Contenido |
|--------|----------|
| `SSH_PRIVATE_KEY` | Clave privada `.pem` |
| `EC2_HOST` | DNS público EC2 |
| `EC2_USER` | `ubuntu` |
| `EC2_TARGET_DIR` | `/var/www/html/` |

---

### ⚙️ C. Workflow YAML

El archivo `.github/workflows/ci-cd.yml` controla el flujo completo.

```yaml
jobs:
  test:
    # npm test

  docs:
    needs: test
    # npm run docs

  deploy:
    needs: [test, docs]
    # rsync con secrets a EC2
```

---

## 5. 🌍 Configuración de Dominio con Ionos

Registro DNS necesario:

| Tipo | Host | Destino |
|------|------|--------|
| CNAME | www / app | DNS público de EC2 |

Ejemplo:

```
www → ec2-44-192-67-45.compute-1.amazonaws.com
```

---

## ✅ Flujo Final de CI/CD

```
Push a GitHub
     │
     ▼
Tests (Jest)
     │
     ▼
Docs (JSDoc)
     │
     ▼
Deploy (rsync → EC2)
```

---

✅ Con esto tienes:

- ES Modules funcionando en Jest
- DOM simulado con JSDOM
- Tests automáticos
- Documentación automática
- Despliegue automático a EC2
- Dominio apuntando a la app

---
