# Revisión del diseño responsivo

**Fecha:** 28-10-2026 · **Servidor:** `npm run dev` (Vite) · **Navegador:** Chrome

El diseño usa la grilla de Bootstrap (`row`, `col-md-*`, `col-lg-*`, `row-cols-*`), el menú
que se pliega bajo 1200 px (`navbar-expand-xl`), las tablas dentro de `.table-responsive` y
unas pocas reglas propias en `src/styles/style.css` (sección 12, «Ajustes responsivos»).
`index.html` declara la meta `viewport`. Este documento registra cómo se comprobó que todo
eso funciona (RNF-06 criterio 3: sin desplazamiento horizontal).

## Cómo se revisó

Cada ruta se cargó dentro de un `iframe` con el ancho a probar (375, 768 o 1280 px). Un
`iframe` se comporta como una ventana de ese ancho, así que Bootstrap y los `@media` se
aplican igual que en un teléfono, una tablet o un computador. Después de que la vista se
dibujó, se comparó el ancho del contenido con el ancho de la ventana:

```js
document.documentElement.scrollWidth <= anchoDeLaVentana   // sin scroll horizontal
```

Si no se cumplía, se anotaban los elementos que sobresalían. Para comprobar que la medición
sirve, se agregó a propósito un elemento de 600 px en una página de 375 px: la medición lo
detectó (`scrollWidth` = 600).

Se probó con los datos de la semilla y con el carrito con dos productos. Las rutas de la
tienda se miraron con sesión de administrador, y las de cuenta (perfil, mis compras, pago
correcto) con la sesión de un cliente.

## Resultado

| Grupo de rutas | 375 px | 768 px | 1280 px |
|---|:---:|:---:|:---:|
| Tienda (19 rutas): inicio, productos, detalle, categorías, ofertas, armado, carrito, pago, pago rechazado, blogs, detalle de blog, nosotros, contacto, registro, login, créditos, perfil, mis compras y página no encontrada | sin desborde | sin desborde | sin desborde |
| Panel (16 rutas): resumen, productos (listado, nuevo, editar, críticos), categorías (listado, nueva, editar), usuarios (listado, nuevo, ficha, editar), órdenes (listado y boleta), reportes y perfil | sin desborde | sin desborde | sin desborde |
| Cuenta de cliente (6 rutas): perfil, mis compras, compra, pago correcto, pago y carrito | sin desborde | sin desborde | sin desborde |

**No fue necesario cambiar ningún estilo ni clase:** ninguna ruta producía scroll
horizontal en los tres anchos.

## Lo que automatizan las pruebas

Ninguna prueba automatizada comprueba hoy el diseño responsivo: la suite se limita a diez
archivos de prueba (ver [`cobertura-testing.md`](cobertura-testing.md)) y jsdom no calcula el
diseño ni el ancho de pantalla. La revisión de arriba es manual.

## Límites

- La revisión es de **ancho** (sin scroll horizontal). No juzga si el diseño se ve bien:
  tamaños de letra, espacios ni la comodidad al tocar los botones.
- Se midió en Chrome. Firefox y Edge (RNF-06 criterio 1) no se midieron, aunque Bootstrap
  se comporta igual en los tres.
- Si se cambia `style.css` o el marcado, conviene repetir la revisión.
