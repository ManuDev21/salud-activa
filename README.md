# Salud Activa — Sistema Integral de Salud

Plataforma híbrida para el control y seguimiento básico de la salud desarrollada por **Comunidad Saludable**.

## Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Backend** | NestJS · TypeORM · GraphQL (Apollo) · MariaDB |
| **Frontend** | React 18 · Vite · TailwindCSS · Framer Motion · Recharts · Lucide Icons |
| **Base de Datos** | MariaDB — esquema `smarthealth` |

## Estructura del Proyecto

```
ProyectoSantiago/
├── server/          # Backend NestJS
├── client/          # Frontend React + Vite
├── database/        # SQL schema
└── README.md
```

## Requisitos Previos

- **Node.js** ≥ 18
- **MariaDB** ≥ 10.6
- **npm** ≥ 9

## Inicio Rápido

### 1. Base de Datos

```bash
mysql -u root -p < database/smarthealth.sql
```

### 2. Backend

```bash
cd server
npm install
# Editar .env con credenciales de MariaDB
npm run start:dev
```

El servidor GraphQL estará en `http://localhost:3000/graphql`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

La app estará en `http://localhost:5173`

## Variables de Entorno (server/.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=smarthealth
JWT_SECRET=salud_activa_secret_key_2024
```
