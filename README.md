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

La URL base del backend la resuelve [`src/config/api.js`](src/config/api.js)
con la constante `API_URL`, y todos los `fetch()` del proyecto la usan
(`fetch(\`${API_URL}/api/juegos\`)`) en vez de escribir rutas sueltas:

- **En desarrollo**: `VITE_API_URL` no está definida, así que `API_URL`
  queda vacía y las peticiones van a rutas relativas (`/api/...`), que
  el proxy de [`vite.config.js`](vite.config.js) redirige a
  `http://localhost:4000`. Esto evita problemas de CORS en local.
- **En producción**: frontend y backend viven en dominios distintos
  (no hay proxy posible), así que se define `VITE_API_URL` como
  variable de entorno del build (ej. `https://backend.hazsoluciones.com`)
  en la plataforma de hosting, y `API_URL` la toma de ahí. Vite la
  incrusta en el código durante `npm run build` — cambiarla requiere
  un build nuevo, no basta con guardarla.

`config/api.js` también expone `urlImagen(ruta)`, que decide si una
imagen debe cargarse desde el backend (`/uploads/...`, subidas por el
admin) o servirse tal cual (`/images/...` del propio frontend, o una
URL externa completa).

## Estructura del proyecto

```
frontend/
├── index.html
├── vite.config.js
├── public/
│   └── images/           ← carátulas de los juegos de ejemplo
└── src/
    ├── main.jsx           ← punto de entrada: BrowserRouter + AuthProvider
    ├── App.jsx            ← define las rutas (react-router-dom)
    ├── index.css          ← Tailwind + fuentes + tokens de color
    ├── config/
    │   └── api.js          ← URL base del backend (API_URL) + urlImagen()
    ├── context/
    │   └── AuthContext.jsx ← sesión del usuario (login/logout, token, toast)
    ├── hooks/
    │   └── useEsMovil.js   ← detecta si la pantalla es de tamaño móvil
    ├── pages/
    │   ├── Catalogo.jsx     ← ruta "/" — estado, lógica y catálogo
    │   ├── Login.jsx        ← ruta "/login" — formulario de acceso
    │   └── Registro.jsx     ← ruta "/registro" — formulario de cuenta nueva
    └── components/
        ├── Header.jsx              ← muestra "Iniciar sesión" o el usuario logueado
        ├── UserMenu.jsx            ← menú del usuario logueado (dentro del Header)
        ├── BuscadorJuegos.jsx      ← input de búsqueda + selector de orden por fecha
        ├── FiltroGeneroDropdown.jsx ← filtro de género (multi-selección)
        ├── TarjetaJuego.jsx
        ├── TarjetaSkeleton.jsx
        ├── Paginacion.jsx
        ├── JuegoFormModal.jsx      ← modal de admin: crear/editar juego + subir imagen
        ├── ConfirmModal.jsx        ← modal de confirmación genérico (eliminar, sobrescribir)
        ├── Toast.jsx               ← aviso flotante (ej. "sesión expirada")
        ├── LoginHero.jsx           ← panel de marca del login (imagen + specs)
        └── icons/
            ├── IconGamepad.jsx
            └── IconUser.jsx
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
- **Imágenes**: las portadas de los juegos vienen del campo `imagen_url`.
  Como admin, el modal de "Agregar/Editar juego" sube la imagen de
  verdad al backend (`POST /api/upload`), que le pone un nombre único
  y la guarda en `backend/uploads/`, devolviendo una ruta relativa
  (`/uploads/<nombre-unico>.webp`). El helper `urlImagen()` de
  [`src/config/api.js`](src/config/api.js) decide cómo resolverla: en
  desarrollo, esa ruta la proxya Vite igual que `/api` (ver
  `vite.config.js`); en producción, se le antepone `API_URL` (la URL
  pública del backend), porque frontend y backend ya no comparten
  dominio. Los 5 juegos de ejemplo usan carátulas guardadas a mano en
  `public/images/` (proporción 2:3), que `urlImagen()` deja tal cual
  por no ser rutas `/uploads/...` — ambos esquemas de imagen funcionan
  al mismo tiempo, ya que `imagen_url` es solo texto.
