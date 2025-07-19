# Guinea App - Backend

API RESTful desarrollada con Node.js, Express y Sequelize, que implementa autenticación JWT, manejo de usuarios y estructura modular. Diseñada para facilitar su despliegue mediante Docker.

---

## Indice

1. [Introduccion](#introducción)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Requisitos](#requisitos)
4. [Instalación](#instalación)
5. [Ejecución](#ejecución)
6. [Dependencias](#dependencias)

## Introducción

Este proyecto consiste en una API con autenticación JWT y ofrece las siguientes características:

- Uso de un ORM (Sequelize) para facilitar conectividad con base de datos
- Uso de JWT como método de autenticación por token
- Encriptación de datos de forma automática sacandole provecho a Sequelize
- Uso de los siguientes conceptos de ExpressJS:
  - Middlewares
  - Router
- Uso de "Environment Variables" para mantener la seguridad.
- Uso de Docker para un fácil transporte de la API

## Estructura del proyecto

```
📁 guinea-prueba-app-backend/
├── 📁 config/                # Carpeta de configuración general
│   └── 📄 config.js          # Archivo de configuración interna para Sequelize
├── 📁 data/                  # Volumen creado para el contenedor
│   └── 📄 database.sqlite    # Base de datos SQLite
├── 📁 migrations/            # Carpeta de migraciones Sequelize
│   └── 📄 [...]
├── 📁 models/                # Carpeta de modelos Sequelize
│   ├── 📄 index.js           # Archivo base de Sequelize
│   ├── 📄 person.js          # Modelo Persona Sequelize
│   └── 📄 user.js            # Modelo Usuario Sequelize
├── 📁 node_modules/          # Carpeta de modulos NPM
│   └── 📁 [...]/
├── 📁 seeders/               # Carpeta de Seeders Sequelize
│   └── 📄 (empty)
├── 📁 src/                   # Carpeta principal del proyecto
│   ├── 📁 middlewares/       # Carpeta de Middlewares Express
│   │   └── 📄 auth.js        # Middleware para la autenticación
│   ├── 📁 routes/            # Carpeta de Rutas Express
│   │   └── 📄 auth.js        # Ruta para la autenticación (login, registro)
│   └── 📄 index.js           # Archivo de configuración Express
├── 📄 .env                   # Archivo de variables de entorno
├── 📄 .env.example           # Archivo de variables de entorno (plantilla)
├── 📄 .gitignore             # Archivo de configuracion GIT (ocultar archivos)
├── 📄 .sequelizerc           # Archivo de configuración Sequelize 
├── 📄 db_schema.jpeg         # Imagen de diagrama SQL.
├── 📄 docker-compose.yml     # Archivo de configuración para el contenedor Docker
├── 📄 Dockerfile             # Archivo de Pre-Ejecución para preparar el contenedor
├── 📄 package-lock.json      # Archivo NodeJS
├── 📄 package.json           # Archivo de gestion de proyecto NodeJS
└── 📄 README.md              # Archivo de documentación.

```

## Requisitos

✅ **Node.js >= 18.0.0**

✅ **NPM >= 10.0.0**

✅ **Docker engine >= 29.0.0 || Docker Desktop**

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/SaidSuyv/guinea-prueba-app-backend
cd guinea-prueba-app-backend
```

### 2. Configurar "Environment Variables"

```bash
cp .env.example .env
```

Editar el archivo `.env` con los siguientes campos
| Variable     | Descripción                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| `PORT`       | Puerto donde se expone Express (ligado al contenedor, no modificar)            |
| `DB_PATH`    | Ruta local del archivo SQLite (base de datos)                                  |
| `JWT_SECRET` | Cadena secreta para firmar tokens JWT (se recomienda un hash de 32 caracteres) |

## Ejecución

### 1. Crear el contenedor docker y levantar la API

#### 1.a. Docker Engine (terminal)

```bash
# Crea el contenedor y lo deja corriendo en segundo plano
docker compose up -d --build

# Agregar las migraciones a la base de datos
docker exec -it <container_name> npx sequelize-cli db:migrate
```

#### 1.b. Docker Desktop

1. Entrar a "Containers".
2. Hacer click en "Open folder" / "Abrir carpeta".
3. Navegar hasta la ubicación del repositorio al nivel donde se encuentra el "docker-compose.yml".
4. Continuar el proceso hasta tener el contenedor ejecutandose.

### 2. Dar de baja a la API y parar/eliminar el contenedor (opcional)

#### 2.a. Docker Engine (terminal)

```bash
# Ejecutar dentro de la carpeta del repositorio
docker compose down
```

#### 2.b. Docker Desktop

1. Entrar a "Containers"
2. Buscar y encontrar el contenedor del proyecto (con nombre "guinea_app_backend")
3. Hacer click en "Stop" para detener el contenedor
4. Hacer click en "Delete" para eliminar el contenedor (opcional)

## Dependencias

### 1. Dependencias principales

| Paquete NPM | Uso | Documentación |
| ----------- | --- | ------------- |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Encriptación de contraseñas |
| [dotenv](https://www.npmjs.com/package/dotenv) | Cargar de  variables de entorno | [Enlace](https://www.npmjs.com/package/dotenv#-documentation) |
| [express](https://www.npmjs.com/package/express) | Framework Web para NodeJS | [Enlace](https://expressjs.com/) |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | Manejo de tokens JWT | [Enlace](https://datatracker.ietf.org/doc/html/rfc7519) |
| [sequelize](https://www.npmjs.com/package/sequelize) | ORM para manejo de base de datos | [Enlace](https://sequelize.org/docs/v6/) |
| [sqlite3](https://www.npmjs.com/package/sqlite3) | Motor de base de datos local | [Enlace](https://github.com/TryGhost/node-sqlite3/wiki/API) |

### 2. Dependencias de desarrollo

| Paquete NPM | Uso | Documentación |
| ----------- | --- | ------------- |
| [nodemon](https://www.npmjs.com/package/nodemon) | Recarga automatica durante desarrollo |
| [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) | Gestión de modelos, migraciones y seeders desde la terminal | [Enlace](https://www.npmjs.com/package/sequelize-cli#documentation) |

## Notas finales

- Esta API utiliza SQLite por simplicidad y portabilidad.
- JWT debe manejarse con cuidado. La clave secreta **no** debe ser expuesta ni compartida