# 🪖 Helldivers Randomizer

> Generador de loadouts aleatorios para **Helldivers 2** — porque la democracia no se defiende siempre con las mismas armas.

Una aplicación web construida con **React + Vite** que genera loadouts aleatorios de stratagemas y armas para el videojuego Helldivers 2. Incluye panel de administración protegido con **Firebase Authentication**.

---

## ✨ Características

- 🎲 Generación aleatoria de loadouts completos
- 🔐 Panel de administración con acceso restringido via Firebase Auth
- ⚡ Desarrollo rápido con Vite + HMR
- 🚀 Deploy automatizado con GitHub Actions
- 📱 Interfaz responsiva

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| React | UI / Componentes |
| Vite | Bundler / Dev Server |
| Firebase Auth | Autenticación del admin |
| Firebase (Firestore/Storage) | Base de datos y almacenamiento |
| GitHub Actions | CI/CD |

---

## 🚀 Instalación y uso local

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Una cuenta y proyecto en [Firebase](https://firebase.google.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/thecrishadow/helldivers-randomizer.git
cd helldivers-randomizer
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá los valores con los datos de tu proyecto de Firebase:

```bash
cp .env.local.example .env.local
```

Luego editá `.env.local`:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Correo del usuario admin creado en Firebase Authentication
VITE_ADMIN_EMAIL=admin@tudominio.com
```

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## 🔐 Configuración de Firebase

1. Creá un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilitá **Authentication** con el proveedor de Email/Password.
3. Creá manualmente el usuario administrador con el correo que usarás en `VITE_ADMIN_EMAIL`.
4. Habilitá **Firestore Database** y/o **Storage** según las necesidades del proyecto.
5. Copiá las credenciales del proyecto (disponibles en *Configuración del proyecto > Tus apps*) en el archivo `.env.local`.

---

## 📦 Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción
npm run preview  # Preview del build de producción
npm run lint     # Linter (ESLint)
```

---

## 📁 Estructura del proyecto

```
helldivers-randomizer/
├── .claude/               # Configuración de Claude Code
├── .github/workflows/     # Pipelines de CI/CD
├── public/                # Archivos estáticos
├── src/                   # Código fuente
├── .env.local.example     # Ejemplo de variables de entorno
├── index.html
├── vite.config.js
└── package.json
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abrí un **Issue** antes de enviar un Pull Request para discutir los cambios propuestos.

1. Forkear el repositorio
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de los cambios (`git commit -m 'feat: descripción del cambio'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

---

## ⚠️ Disclaimer

Este proyecto es un fan-made y no está afiliado con Helldivers, Arrowhead Game Studios ni PlayStation Studios.

---

## 📄 Licencia

Distribuido bajo licencia MIT. Ver `LICENSE` para más información.
