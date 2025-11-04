 Mini ERP - Sistema de Gestión de Reservas de Salas

Sistema full-stack de gestión de reservas de salas con autenticación JWT, roles de usuario (ADMIN/USER), y operaciones CRUD completas.

## 🚀 Stack Tecnológico

### Backend
- **Node.js** + **TypeScript**
- **Apollo Server** (GraphQL)
- **Prisma ORM** (PostgreSQL)
- **Restify** (servidor HTTP)
- **JWT** (autenticación)
- **bcryptjs** (hash de contraseñas)

### Frontend
- **React** + **TypeScript**
- **Apollo Client** (consumo GraphQL)
- **Material-UI v6** (componentes UI)
- **Vite** (build tool)

---

## 📋 Prerequisitos

- **Node.js** >= 18.x
- **npm**
- **Docker**
---

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/DAN263263/growby-fullstack-challenge.git
cd growby-fullstack-challenge
```

### 2. Backend (API)

#### 2.1. Navegar a la carpeta del backend

```bash
cd api
```

#### 2.2. Instalar dependencias

```bash
npm install
```

#### 2.2. Instalar bd con docker desde la carpeta raiz

```bash
docker compose up -d
```

#### 2.3. Configurar variables de entorno y creamos las bd segun schema definido con prisma

```bash
cd api
cp .env.example .env
npm run migrate
npm run seed
```

#### 2.4. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:4000/graphql`.

---

### 3. Frontend (Web)

#### 3.1. Navegar a la carpeta del frontend

```bash
cd ../web
```

#### 3.2. Instalar dependencias

```bash
npm install
```

#### 3.3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🎯 Uso del Sistema

### Credenciales por defecto

- **Admin:**
  - Email: `admin@example.com`
  - Password: `Admin123!`

### Roles y Permisos

| Funcionalidad | USER | ADMIN |
|--------------|------|-------|
| Ver reservas | ✅ | ✅ |
| Crear reservas | ✅ | ✅ |
| Editar reservas | ❌ | ✅ |
| Eliminar reservas | ❌ | ✅ |
| Gestionar salas | ❌ | ✅ |
| Gestionar usuarios | ❌ | ✅ |

---

## 📁 Estructura del Proyecto

```
.
├── api/                      # Backend (GraphQL API)
│   ├── prisma/
│   │   ├── schema.prisma     # Schema de base de datos
│   │   └── migrations/       # Migraciones
│   ├── src/
│   │   ├── index.ts          # Punto de entrada
│   │   ├── resolvers/        # Resolvers GraphQL
│   │   └── typeDefs/         # Schemas GraphQL
│   ├── .env                  # Variables de entorno
│   └── package.json
│
└── web/                      # Frontend (React + Apollo Client)
    ├── src/
    │   ├── apollo/           # Configuración Apollo Client
    │   ├── components/       # Componentes reutilizables
    │   ├── context/          # Context API (AuthContext)
    │   ├── hooks/            # Custom hooks
    │   ├── modules/          # Módulos de negocio
    │   ├── pages/            # Páginas principales
    │   ├── types/            # Tipos TypeScript
    │   └── utils/            # Utilidades
    ├── .env                  # Variables de entorno
    └── package.json
```

---

---


## 👤 Autor:

Daniel Ponce - [daniel.nspx@gmail.com]

## 🔗 Links

- Repositorio: [https://github.com/DAN263263/growby-fullstack-challenge.git]