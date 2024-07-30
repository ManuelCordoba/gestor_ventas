# Proyecto Web con Angular y Django REST Framework

## Descripción

Este proyecto es una aplicación web que utiliza **Angular** para el frontend y **Django REST Framework** para el backend. El objetivo del proyecto es proporcionar un sistema Administrativo de ventas
básico de productos para el aseo personal de clientes registrados

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Configuración del Backend](#configuración-del-backend)
- [Configuración del Frontend](#configuración-del-frontend)
- [Uso](#uso)


## Requisitos

### Database

- MySQL Server 8.033

### Backend

- Python 3.8.0
- virtualenv 20.26.3

### Frontend

- Node.js 20.15.0 o superior
- Angular CLI 18.1.2 o superior

## Configuración Database

1. **Crear base de datos Ejemplo:**

    ```bash
    CREATE SCHEMA `cleaning_sales` ;

    ```
    
## Configuración del Backend

1. **Clona el repositorio:**

    ```bash
    git clone https://github.com/ManuelCordoba/gestor_ventas.git
    cd tu_repositorio/backend
    ```

2. **Crea y activa un entorno virtual:**

    ```bash
    python -m venv env
    source env/bin/activate  # En Windows usa `env\Scripts\activate`
    ```

3. **Instala las dependencias:**

    ```bash
    pip install -r requirements.txt
    ```



4. **Configurar variables de entorno en el archivo .env Ejemplo:**

    ```bash
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    DATABASE_NAME=cleaning_sales
    DATABASE_USER=root2
    DATABASE_PASS=password
    ALLOWED_HOST=localhost,127.0.0.1
    ```
    
4. **Realiza las migraciones:**

    ```bash
    python manage.py migrate
    ```

5. **Inicia el servidor:**

    ```bash
    python manage.py runserver
    ```

## Configuración del Frontend

1. **Instala las dependencias:**

    ```bash
    cd frontend
    npm install
    ```

2. **Inicia el servidor de desarrollo:**

    ```bash
    ng serve
    ```

    La aplicación estará disponible en `http://localhost:4200`.

## Uso

- **Backend:** El backend estará disponible en `http://localhost:8000` por defecto.
- **Frontend:** La aplicación Angular estará disponible en `http://localhost:4200`.

Para interactuar con la API, puedes usar herramientas como [Postman](https://www.postman.com) y usar colection ubucada en la carpeta del Backend o hacer peticiones desde el frontend.

---