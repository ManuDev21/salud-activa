# Deploy Salud Activa en Hostinger

## Opción A: Hostinger Web Hosting (Shared) con Node.js

### Paso 1: Verificar soporte Node.js
1. Entra a **hPanel** → Tu sitio → **Avanzado** → **Node.js**
2. Si ves la sección Node.js, tu plan lo soporta. Continúa con Paso 2.
3. Si NO ves Node.js, ve a **Opción B** abajo.

### Paso 2: Subir archivos
1. Ve a **hPanel** → **Administrador de archivos**
2. Entra a la carpeta `public_html`
3. **Elimina** todo el contenido existente de `public_html`
4. Sube los siguientes archivos/carpetas desde tu PC:

```
Subir desde:                          → A la carpeta:
server/dist/                          → public_html/dist/
server/package.json                   → public_html/package.json
server/tsconfig.json                  → public_html/tsconfig.json
server/.env                           → public_html/.env
client/dist/                          → public_html/client/dist/
```

La estructura en `public_html` debe quedar:
```
public_html/
├── .env
├── package.json
├── tsconfig.json
├── dist/           ← (backend compilado)
│   └── *.js
└── client/
    └── dist/       ← (frontend compilado)
        ├── index.html
        └── assets/
```

### Paso 3: Crear Base de Datos
1. Ve a **hPanel** → **Bases de datos** → **MySQL**
2. Crea una nueva base de datos:
   - Nombre: `smarthealth`
   - Usuario: (anota el usuario completo, ej: `u123456789_smarthealth`)
   - Contraseña: (elige una segura)
3. Abre **phpMyAdmin** desde hPanel
4. Selecciona la base de datos creada
5. Ve a la pestaña **Importar**
6. Sube el archivo `database/seed.sql` (contiene estructura + datos)

### Paso 4: Editar .env en el servidor
En el Administrador de archivos, edita `public_html/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=u123456789_smarthealth    ← (tu usuario de BD en Hostinger)
DB_PASSWORD=TU_CONTRASEÑA_BD      ← (la que elegiste)
DB_NAME=u123456789_smarthealth    ← (nombre completo de la BD)
JWT_SECRET=salud_activa_secret_key_2024
PORT=3000
```

### Paso 5: Configurar Node.js en hPanel
1. Ve a **Avanzado** → **Node.js**
2. Configura:
   - **Versión Node.js**: 18.x o 20.x
   - **Directorio raíz**: `public_html`
   - **Archivo de inicio**: `dist/main.js`
   - **Puerto**: 3000
3. Click en **Instalar dependencias** (npm install)
4. Click en **Iniciar aplicación**

### Paso 6: Verificar
- Abre tu dominio en el navegador
- Deberías ver la página de login de Salud Activa
- Inicia sesión con: juan@salud.com / 123456

---

## Opción B: Si NO tienes Node.js en tu plan

El hosting compartido básico de Hostinger solo soporta PHP. En ese caso:

### Alternativa 1: Upgrade de plan
- Upgrade a **Business** o **Cloud** hosting que incluye Node.js

### Alternativa 2: Deploy híbrido (gratis)
- **Frontend** → Hostinger (archivos estáticos en public_html)
- **Backend** → Railway.app o Render.com (gratis, soporta Node.js)

Para esta alternativa:

#### A. Frontend en Hostinger
1. Sube el contenido de `client/dist/` a `public_html/`
2. Crea un archivo `.htaccess` en `public_html/`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### B. Backend en Railway.app
1. Crea cuenta en https://railway.app
2. Conecta tu repo o sube el código del `server/`
3. Agrega las variables de entorno (.env)
4. Railway te dará una URL como: `https://tu-app.up.railway.app`
5. Actualiza `client/src/graphql/client.js` con esa URL

---

## Credenciales de prueba
| Rol      | Correo           | Contraseña |
|----------|------------------|------------|
| Usuario  | juan@salud.com   | 123456     |
| Familiar | maria@salud.com  | 123456     |
