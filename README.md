# PoliStyle

Catálogo virtual de ropa para hombre y mujer (camisas, pantalones y zapatos). El cliente explora el catálogo, busca y filtra productos, arma su carrito y hace el pedido con **pago contra entrega en efectivo**, con envíos a Bogotá.

Proyecto académico de la materia TSP, Politécnico Grancolombiano.

## Tecnologías

| Para qué | Qué usamos |
| --- | --- |
| Interfaz | React 19 + TypeScript |
| Herramienta de desarrollo y build | Vite |
| Estilos | Tailwind CSS v4 (con un tema propio de colores) |
| Rutas | React Router |
| Usuarios y datos | Firebase (Authentication y Firestore) |
| Publicación | Firebase Hosting (sitio: `poli-tsp-catalogo-virtual.web.app`) |
| Gestor de paquetes | **yarn** (no usar npm) |

## Requisitos

- [Node.js](https://nodejs.org) 22 o superior.
- yarn (`npm install -g yarn` solo esa vez, si no lo tienes).
- Git.

## Instalación

```bash
git clone https://github.com/IsmaelMatiz/Poli-TSP-Style.git
cd Poli-TSP-Style
yarn
```

## Configuración (Firebase)

Las llaves de Firebase **no están en el repositorio**. Ismael las pasa por privado en un archivo `.env.local`.

1. Copia ese archivo a la raíz del proyecto, junto a `package.json`.
2. No lo subas a Git (ya está en `.gitignore`).

Si no tienes el archivo, usa `.env.example` como guía: tiene los nombres de las variables sin valores.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `yarn dev` | Abre el sitio en modo desarrollo (normalmente en http://localhost:5173) y se actualiza al guardar |
| `yarn build` | Revisa los tipos y genera la versión final en `dist/` |
| `yarn preview` | Sirve la versión de `dist/` para probarla |
| `yarn lint` | Revisa el código con ESLint |

Antes de subir cambios, corre `yarn lint` y `yarn build`: los dos deben pasar sin errores.

## Estructura del proyecto

```
src/
├── main.tsx           # Punto de entrada: aquí se registran todas las rutas
├── App.tsx            # Página de inicio (catálogo)
├── NotFoundPage.tsx   # Página 404
├── index.css          # Tailwind y colores del tema
├── components/        # Piezas compartidas: Layout, Header, Footer
├── features/          # Una carpeta por funcionalidad
│   ├── auth/          #   Login y Register
│   ├── cart/          #   Carrito
│   ├── catalog/       #   Detalle de producto
│   └── search/        #   Búsqueda y filtros
└── lib/
    └── firebase.ts    # Conexión a Firebase (exporta auth y db)
```

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio / catálogo |
| `/producto/:id` | Detalle de un producto |
| `/buscar` | Búsqueda |
| `/carrito` | Carrito de compras |
| `/ingresar` | Iniciar sesión |
| `/registro` | Crear cuenta |
| cualquier otra | Página 404 |

Todas las páginas comparten el **Layout** (Header arriba, Footer abajo y el contenido en medio).

## Convenciones del equipo

- **El nombre del archivo es el mismo que el de la función.** `Cart.tsx` contiene `function Cart()`.
- **Siempre `export default`** en páginas y componentes.
- Los imports llevan la extensión: `import Cart from './features/cart/Cart.tsx'`.
- Cada quien trabaja dentro de la carpeta de su funcionalidad en `src/features/`.
- Para moverse entre páginas se usa `Link` de `react-router`, nunca `<a href>` (el `<a>` recarga todo el sitio).
- Los colores salen del tema de `src/index.css`, no se escriben colores sueltos.

### Colores del tema

Se usan como clases de Tailwind (`bg-verde`, `text-ambar`, `border-borders`...):

| Nombre | Uso |
| --- | --- |
| `verde` | Texto principal, botones oscuros |
| `ambar` | Botones de acción |
| `main-bg` | Fondo de la página |
| `second-bg` | Fondos de secciones |
| `nav-pill` | Menú de navegación |
| `borders` | Bordes |
| `secondary-color` | Texto secundario |
| `cat-shirt`, `cat-pants`, `cat-shoes` | Tarjetas de cada categoría |

## Cómo trabajamos con Git

- `main`: lo que está estable.
- `develop`: donde se junta el trabajo del equipo.
- Cada tarea va en su propia rama que sale de `develop`, y se une con un Pull Request.
- No se sube `package-lock.json` (usamos `yarn.lock`) ni el `.env.local`.

```bash
git checkout develop
git pull
git checkout -b nombre-de-tu-rama
# ... trabajas y haces commits ...
git push -u origin nombre-de-tu-rama
```

## Publicación (Firebase Hosting)

El sitio se publicará en Firebase Hosting con el proyecto `poli-tsp-catalogo-virtual`. Pasos generales:

1. `yarn build` genera la carpeta `dist/`.
2. Firebase publica esa carpeta (`firebase deploy`).
3. El sitio se configura como aplicación de una sola página: cualquier ruta (por ejemplo `/producto/abc`) debe devolver `index.html`, para que recargar no dé error 404.

> **Pendiente:** la configuración de Hosting (`firebase.json` y `.firebaserc`) todavía no se ha creado.

## Qué conviene aprender

Para trabajar en el proyecto, repasa estos temas con la documentación oficial:

- **React:** componentes, `props`, `useState` y `useEffect`. [react.dev](https://react.dev)
- **React Router:** `Route`, `Link`, `Outlet` y `useParams` (leer el `:id` de la URL). [reactrouter.com](https://reactrouter.com)
- **Tailwind CSS:** cómo se escriben las clases (`p-4`, `flex`, `md:grid-cols-3`...). [tailwindcss.com](https://tailwindcss.com)
- **Firebase:** iniciar sesión con Authentication y leer datos de Firestore. [firebase.google.com/docs](https://firebase.google.com/docs)
- **Git:** ramas, commits y Pull Requests.
