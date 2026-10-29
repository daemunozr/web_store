# Paridad entre el sitio de la Entrega I (`legacy/`) y la aplicación React (`src/`)

Auditoría del 26-10-2026. Objetivo: comprobar que todo lo que hacía el sitio HTML/JS de la
Entrega I existe en la aplicación React. Resultado: **no hay brechas**; todo lo del legacy
tiene su equivalente en `src/`, y la aplicación React agrega lo de la Entrega II.

Leyenda: ✅ equivalente · ⚠️ diferencia justificada.

## Método

| Paso | Qué se hizo |
|------|-------------|
| Vistas | Cada `legacy/pages/*.html` se contrastó con las rutas de `src/App.jsx`. |
| Datos | Un script comparó, valor por valor, las diez colecciones de `legacy/scripts/datos.js` con `src/data/semillas.js`. |
| Recursos | Se comprobó que cada imagen y video citado por las semillas existe en `public/resources/`. |
| Comportamiento | Se contrastó cada función de los 9 scripts con su componente, hook o regla en React; se buscó cada mensaje de usuario del legacy en `src/`. |
| Código | `grep` en `src/`: no hay `document.querySelector`, `innerHTML` ni referencias a `legacy/` (solo `main.jsx` usa `getElementById("root")`). |

## Vistas y rutas

| Legacy | React | |
|--------|-------|---|
| `index.html` | `/` · `pages/Inicio.jsx` | ✅ |
| `productos.html` | `/productos` · `pages/Productos.jsx` | ✅ |
| `producto.html` | `/productos/:sku` · `pages/Producto.jsx` | ✅ |
| `carrito.html` | `/carrito` · `pages/Carrito.jsx` | ✅ |
| `armado.html` | `/armado` · `pages/Armado.jsx` | ✅ |
| `blogs.html`, `blog.html` | `/blogs`, `/blogs/:slug` · `pages/Blogs.jsx`, `Blog.jsx` | ✅ |
| `nosotros.html`, `contacto.html`, `creditos.html` | `/nosotros`, `/contacto`, `/creditos` | ✅ |
| `registro.html`, `login.html` | `/registro`, `/login` | ✅ |
| `header/nav/aside/footer/body.html` | `components/layout/` (`Header`, `Nav`, `Aside`, `Footer`, `Layouts`) | ✅ |
| `admin/index.html` | `/admin` · `pages/admin/Resumen.jsx` | ✅ |
| `admin/productos.html`, `producto.html` | `/admin/productos`, `/nuevo`, `/:sku/editar` | ✅ |
| `admin/usuarios.html`, `usuario.html` | `/admin/usuarios`, `/nuevo`, `/:run/editar` | ✅ |
| `admin/ordenes.html`, `orden.html` | `/admin/ordenes`, `/admin/ordenes/:numero` | ✅ |
| `admin/aside.html` | `components/layout/AsideAdmin.jsx` | ✅ |

## Scripts

| Legacy | React | |
|--------|-------|---|
| `validaciones.js`: RUN con dígito verificador, dominios permitidos, mínimos y máximos, contraseña 4–10, región→comuna, sugerencias, mensajes | `utils/validaciones.js`, `hooks/useFormulario.js`, `components/Campo*.jsx`, `SelectRegionComuna.jsx`. Mismos límites (50/100/300/500) y mismo texto de los errores. | ✅ |
| Registro y contacto con aviso de éxito | `pages/Registro.jsx`, `pages/Contacto.jsx` con los mismos mensajes | ✅ |
| Registro: RUN o correo ya registrados | `data/datos.js (crearUsuario)` los rechaza; cambia el texto («Ya existe un usuario con RUN…») | ⚠️ |
| `sesion.js`: sesión, inicio según rol, logout, protección de vistas, menú por rol, enlace activo, año del pie | `context/SesionProvider.jsx`, `RutaProtegida.jsx`, `Login.jsx`, `Header.jsx`, `Nav.jsx` (`NavLink`), `Footer.jsx` | ✅ |
| `carrito.js`: lectura tolerante a datos corruptos, tope por stock, líneas y armados, cantidades, vaciar, aviso al agregar | `logic/carrito.js`, `context/CarritoProvider.jsx`, `BotonAgregar.jsx`, `Carrito.jsx`, `Toasts.jsx` (Bootstrap por React). Mismos mensajes («no tiene stock disponible», «Solo puedes llevar…»). `vaciar` ahora lo usa el pago. | ✅ |
| `catalogo.js`: destacados (mismos 6 SKU), rejilla, listado, detalle con video, sin productos, producto inexistente | `Inicio.jsx`, `Productos.jsx`, `Producto.jsx`, `RejillaProductos.jsx`, `TarjetaProducto.jsx` | ✅ |
| `armado.js`: modos completo y módulos, filtrado por compatibilidad, omitir, volver, finalizar, seguir, reiniciar, agregar | `pages/Armado.jsx`, `logic/armado.js` (reducer con las mismas transiciones) | ✅ |
| `mantenedores.js`: resumen, listados y formularios de productos y usuarios, órdenes y detalle | `pages/admin/*`. Mismas columnas en los listados (productos: imagen, código, nombre, categoría, precio, stock, crítico, alerta, acciones; usuarios; órdenes; detalle de la orden). | ✅ |
| `blogs.js` | `Blogs.jsx`, `Blog.jsx` | ✅ |
| `includes.js`: compone cada página con `fetch()` de fragmentos HTML | Reemplazado por componentes y `Layouts.jsx`; ya no hay `fetch()` | ⚠️ |
| `datos.js`: colecciones y lectura/escritura en `sessionStorage` | `data/semillas.js`, `data/coleccion.js`, `data/datos.js` | ✅ |

## Datos y recursos

Las diez colecciones tienen los mismos registros y valores: 9 categorías, 32 productos,
83 pares de compatibilidad, 16 regiones, 78 comunas, 3 roles, 5 usuarios y 3 blogs. Todas
las imágenes y videos citados existen en `public/resources/`.

Diferencias intencionales (Entrega II):

- `productos` agrega `descuento` en los productos en oferta (RF-18).
- `ordenes` pasa de 4 a 7 (ORD-2026-0005 a 0007) y cada orden agrega nombre, correo,
  dirección, comuna, entrega, costo de envío y medio de pago (RF-22).
- `itemsOrden` pasa de 10 a 16 líneas por esas órdenes nuevas.

## Hallazgos

- **Brechas (❌): ninguna.**
- **Lo que el legacy tenía y React no copia tal cual:** la composición por `fetch()` de
  fragmentos HTML (`includes.js`) y los `window.Datos`, `window.Carrito` y `window.Armado`
  globales, que reemplazan los contextos y hooks de React. No hay pérdida de función.
- **Riesgo restante:** la cobertura automatizada es parcial. Hay 10 pruebas en 10 archivos
  (componentes, `useFormulario`, `Carrito` y `Checkout`) y 34,83 % de sentencias (ver
  [`cobertura-testing.md`](cobertura-testing.md)). El resto de las vistas, incluido el panel de
  administración, se revisó a mano. El diseño responsivo se revisó a 375, 768 y 1280 px
  ([`responsividad.md`](responsividad.md)); siguen siendo manuales el aspecto visual y la impresión.

## Qué sigue en HTML/JS puro

Solo `legacy/` (sitio de la Entrega I, excluido de ESLint y del empaquetado). Ningún archivo
de `src/` lo importa ni lo referencia. Se conserva por decisión del proyecto como referencia;
retirarlo no afecta a la aplicación (el sitio queda en el historial de git).
