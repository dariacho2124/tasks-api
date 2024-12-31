# Documentación de la API

## Tabla de Contenidos

- [Introducción](#introducción)
- [Autenticación](#autenticación)
- [Endpoints de Usuarios](#endpoints-de-usuarios)
- [Endpoints de Tareas](#endpoints-de-tareas)
- [Configuración y Ejecución del Proyecto](#configuración-y-ejecución-del-proyecto)

---

## Introducción

Esta API proporciona endpoints para gestionar usuarios y tareas. Los endpoints de tareas están protegidos mediante autenticación JWT, y los usuarios deben iniciar sesión para obtener un token.

---

## Autenticación

La API utiliza JWT para la autenticación. Es necesario incluir un JWT válido en el encabezado `Authorization` para acceder a las rutas protegidas.

### Iniciar Sesión para Obtener JWT

**Endpoint:** `/users/login`

**Método:** `POST`

**Cuerpo de la Solicitud:**

```json
{
  "username": "admin",
  "password": "admin-test"
}
```

**Respuesta:**

- **200 OK**:

```json
{
  "token": "<JWT Token>"
}
```

- **401 Unauthorized**: Credenciales inválidas

**Nota:** Reemplace `<JWT Token>` con el token recibido.

---

## Endpoints de Usuarios

### 1. Iniciar Sesión

**Endpoint:** `/users/login`

- **Método:** `POST`
- **Cuerpo de la Solicitud:**

```json
{
  "username": "admin",
  "password": "admin-test"
}
```

- **Respuesta:**
  - **200 OK**:
  ```json
  {
    "token": "<JWT Token>"
  }
  ```
  - **401 Unauthorized**: Credenciales inválidas

---

## Endpoints de Tareas

Todos los endpoints de tareas están protegidos y requieren un JWT válido en el encabezado `Authorization`.

### 1. Crear Tarea

**Endpoint:** `/tasks`

- **Método:** `POST`
- **Encabezados:**
  - `Authorization: Bearer <JWT Token>`
- **Cuerpo de la Solicitud:**

```json
{
  "title": "Título de la tarea",
  "description": "Descripción de la tarea",
  "completed": false
}
```

- **Respuesta:**
  - **201 Created**:
  ```json
  {
    "_id": "idDeLaTarea",
    "title": "Título de la tarea",
    "description": "Descripción de la tarea",
    "completed": false
  }
  ```
  - **400 Bad Request**: Errores de validación
  - **401 Unauthorized**: Token ausente o inválido

---

### 2. Obtener Todas las Tareas

**Endpoint:** `/tasks`

- **Método:** `GET`

- **Encabezados:**

  - `Authorization: Bearer <JWT Token>`

- **Parámetros de Consulta (Opcional):**

  - `status`: `completed` o `pending`

- **Respuesta:**

  - **200 OK**:

  ```json
  [
    {
      "_id": "idDeLaTarea",
      "title": "Título de la tarea",
      "description": "Descripción de la tarea",
      "completed": false
    }
  ]
  ```

  - **401 Unauthorized**: Token ausente o inválido

---

### 3. Obtener Tarea por ID

**Endpoint:** `/tasks/{id}`

- **Método:** `GET`

- **Encabezados:**

  - `Authorization: Bearer <JWT Token>`

- **Respuesta:**

  - **200 OK**:

  ```json
  {
    "_id": "idDeLaTarea",
    "title": "Título de la tarea",
    "description": "Descripción de la tarea",
    "completed": false
  }
  ```

  - **404 Not Found**: Tarea no encontrada
  - **401 Unauthorized**: Token ausente o inválido

---

### 4. Actualizar Tarea

**Endpoint:** `/tasks/{id}`

- **Método:** `PUT`
- **Encabezados:**
  - `Authorization: Bearer <JWT Token>`
- **Cuerpo de la Solicitud (Actualización Parcial o Completa):**

```json
{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "completed": true
}
```

- **Respuesta:**
  - **200 OK**:
  ```json
  {
    "_id": "idDeLaTarea",
    "title": "Título actualizado",
    "description": "Descripción actualizada",
    "completed": true
  }
  ```
  - **404 Not Found**: Tarea no encontrada
  - **400 Bad Request**: Errores de validación
  - **401 Unauthorized**: Token ausente o inválido

---

### 5. Eliminar Tarea

**Endpoint:** `/tasks/{id}`

- **Método:** `DELETE`

- **Encabezados:**

  - `Authorization: Bearer <JWT Token>`

- **Respuesta:**

  - **200 OK**:

  ```json
  {
    "message": "Tarea eliminada"
  }
  ```

  - **404 Not Found**: Tarea no encontrada
  - **401 Unauthorized**: Token ausente o inválido

---

## Configuración y Ejecución del Proyecto

### Requisitos Previos

1. **Node.js**: Instalar Node.js versión 14 o superior.
2. **MongoDB**: Asegúrese de que MongoDB esté ejecutándose localmente o proporcione una cadena de conexión.

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/dariacho2124/tasks-api.git
cd tasks-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en el directorio raíz y agregar lo siguiente:

```env
JWT_SECRET=su_clave_secreta
MONGO_URI=su_cadena_de_conexión_de_mongo
```

4. Iniciar el servidor:

```bash
npm run dev
```

5. Acceder a la API en `http://localhost:3300`.

---

## Notas

- Utilice herramientas como Postman o Swagger UI para probar los endpoints de la API.
- Reemplace `<JWT Token>` en los encabezados con el token obtenido del endpoint `/users/login`.

---

## Documentación Swagger

La documentación de la API está disponible en `/api-docs` cuando el servidor está en ejecución.
