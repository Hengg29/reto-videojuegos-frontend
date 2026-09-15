# Reto Videojuegos — Frontend

Interfaz web (React + Vite) para un catálogo de videojuegos, que consume la
API del backend.

Repo del backend: https://github.com/Hengg29/reto-videojuegos-backend

## Requisitos

- Node.js (v18 o superior recomendado)
- El backend corriendo en `http://localhost:4000` (ver el repo del backend)

## Instalación y ejecución local

```bash
npm install
npm run dev
```

Esto levanta la app en `http://localhost:5173` (o el siguiente puerto libre
si ese ya está ocupado).

## Conexión con el backend

Las peticiones a `/api/...` se redirigen automáticamente al backend
(`http://localhost:4000`) mediante el proxy configurado en
[`vite.config.js`](vite.config.js). Esto evita problemas de CORS y permite
usar rutas relativas (`fetch('/api/health')`) en vez de escribir la URL
completa del backend en el código.

## Estructura del proyecto

```
frontend/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx     ← punto de entrada de React
    ├── App.jsx      ← componente principal
    ├── App.css
    └── index.css
```
