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
├── public/
│   └── images/           ← carátulas de los juegos
└── src/
    ├── main.jsx           ← punto de entrada: BrowserRouter + AuthProvider
    ├── App.jsx            ← define las rutas (react-router-dom)
    ├── index.css          ← Tailwind + fuentes + tokens de color
    ├── context/
    │   └── AuthContext.jsx ← sesión del usuario (login/logout, token)
    ├── hooks/
    │   └── useEsMovil.js   ← detecta si la pantalla es de tamaño móvil
    ├── pages/
    │   ├── Catalogo.jsx     ← ruta "/" — estado, lógica y catálogo
    │   └── Login.jsx        ← ruta "/login" — formulario de acceso
    └── components/
        ├── Header.jsx        ← muestra "Iniciar sesión" o el usuario logueado
        ├── FiltroPill.jsx
        ├── TarjetaJuego.jsx
        ├── TarjetaSkeleton.jsx
        ├── Paginacion.jsx
        ├── LoginHero.jsx     ← panel de marca del login (imagen + specs)
        └── icons/
            └── IconGamepad.jsx
```

La idea de esta separación (igual que en el backend con `routes/`/
`controllers/`): `pages/` tiene una vista completa por ruta (con su
propio estado y lógica), y cada pieza visual reutilizable entre
páginas vive en `components/`. Cuando agregues una nueva vista (ej. un
panel de admin), creas su archivo en `pages/` y lo registras en
`App.jsx`.

> **Nota para cuando despliegues:** como se usa `react-router-dom` en
> modo navegador (URLs "limpias" como `/login`), la plataforma donde
> subas el sitio (Vercel, Netlify, etc.) necesita una regla de
> "SPA fallback" que redirija cualquier ruta a `index.html`. Vercel y
> Netlify lo detectan automático para proyectos de Vite; si usas otro
> hosting y ves un 404 al entrar directo a `/login`, es por eso.

## Diseño

- **Estilo**: minimalista, dark mode, sin gradientes ni sombras de color —
  bordes finos, tipografía como principal elemento visual.
- **Paleta**: escala de grises (`neutral`) sobre fondo oscuro, con blanco
  como único acento para estados activos/CTA.
- **Tipografía**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
  para títulos, [Inter](https://fonts.google.com/specimen/Inter) para
  texto — cargadas desde Google Fonts en `src/index.css`.
- **Imágenes**: las portadas de los juegos vienen del campo `imagen_url` en
  la base de datos. Las carátulas reales están guardadas en
  `public/images/` (proporción 2:3) y la base de datos apunta a ellas
  como `/images/archivo.webp`. Para agregar una nueva, guarda el archivo
  ahí y actualiza `imagen_url` en MySQL con esa ruta.
