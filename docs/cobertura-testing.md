# Documento de cobertura de testing

**Proyecto:** Ensambla.me — Tienda online de componentes de PC
**Asignatura:** DSY1104 Desarrollo Fullstack II · Evaluación Parcial N° 2
**Autor:** Daniel Muñoz
**Fecha de medición:** 26-10-2026 (Vitest 5.0.5, cobertura v8)

Este documento valida el alcance de los elementos cubiertos por las pruebas
unitarias del frontend (React + Vite), reemplazando Jasmine y Karma por Vitest
según lo indicado para la evaluación. Todas las cifras salen de ejecutar
`npm run coverage` sobre el código entregado.

## 1. Resumen

| Métrica | Antes (solo `App.test.jsx`) | Ahora |
|---|---:|---:|
| Archivos de prueba | 1 | **46** |
| Pruebas | 2 | **470** (todas pasan) |
| Sentencias | 17,14 % | **73,63 %** |
| Ramas | 4,94 % | **62,77 %** |
| Funciones | 13,35 % | **71,90 %** |
| Líneas | 19,42 % | **72,65 %** |

La capa con reglas de negocio (`logic/`, `utils/`, `data/`) queda sobre el 96 %
de líneas; lo no cubierto son sobre todo páginas de presentación del panel
(sección 6).

## 2. Herramientas y cómo ejecutar

| Herramienta | Uso |
|---|---|
| Vitest 5 | Ejecutor de pruebas, aserciones, mocks y cobertura (integrado en Vite) |
| jsdom | Entorno de navegador simulado |
| @testing-library/react y /dom | Montaje y consulta de componentes por rol, etiqueta y texto, como lo ve el usuario |
| @testing-library/user-event | Simulación de escritura, clics, teclado y selección |
| @testing-library/jest-dom | Aserciones del DOM (`toBeInTheDocument`, `toBeDisabled`, `toHaveClass`…) |
| @vitest/coverage-v8 | Informe de cobertura (consola y `coverage/index.html`) |

Configuración en `vite.config.js` (entorno `jsdom`, `globals: true`, setup en
`src/setupTests.js`). Se excluyen de la cobertura los archivos de arranque y
apoyo (`main.jsx`, `setupTests.js`, `testUtils.jsx`), los datos de ejemplo
(`semillas.js`, `creditos.js`) y las propias pruebas.

```
npm run test:run   # una pasada de todas las pruebas
npm test           # modo watch
npm run coverage   # cobertura: tabla en consola + coverage/index.html
```

## 3. Estrategia

Las pruebas van junto al archivo que prueban (`foo.js` → `foo.test.js`) y se
organizan de lo más puro a lo más integrado:

1. **Lógica pura** (`logic/`, `utils/`): funciones sin DOM ni almacenamiento.
   Reciben como parámetro cómo buscar un producto, así que se prueban con un
   catálogo de juguete y sin tocar los datos reales.
2. **Capa de datos** (`data/`): CRUD y reglas de integridad sobre una copia de
   trabajo en `sessionStorage`, que se limpia antes de cada prueba.
3. **Contextos y hooks**: `renderHook` de Testing Library para `useFormulario`,
   `useEliminacion`, `useCriterios` y los proveedores de sesión y carrito.
4. **Componentes**: cada componente aislado, con sus props, estados y eventos.
5. **Páginas y flujos**: vistas completas montadas con los proveedores reales
   (`src/testUtils.jsx`) dentro de un `MemoryRouter`: inicio de sesión, catálogo
   con filtros, carrito, checkout con pago aprobado y rechazado, y el
   mantenedor de productos con su confirmación de borrado.

### Correspondencia con las pruebas propuestas en el Anexo 1

| Tipo de prueba del Anexo 1 | Ejemplos en el proyecto |
|---|---|
| **Renderizado correcto** | `RejillaProductos` muestra una tarjeta por producto; `Productos` muestra todo el catálogo; `Producto` muestra la ficha completa |
| **Renderizado condicional** | `ZonaAviso` solo muestra la alerta si hay aviso; `Campo` muestra error y sugerencia solo si vienen; `ModalConfirmacion` no existe cerrado; `Checkout` oculta la tarjeta en un pedido sin costo; el panel de productos oculta las acciones al rol logístico |
| **Propiedades (props)** | `Alerta` aplica `alert-{tipo}`; `Campo` liga etiqueta e id y propaga `aria-invalid` según `estado`; `TarjetaProducto` usa `nivel` para el encabezado; `PrecioProducto` respeta `mostrarGratis` |
| **Estado (state)** | `useFormulario` cambia valores y errores al escribir; `CajaBusqueda` con estado conserva el texto y actualiza el conteo; el carrito actualiza el total al cambiar la cantidad |
| **Eventos** | `userEvent.type`, `click`, `selectOptions` y `keyboard` en formularios, filtros, modal (Escape, clic en el fondo), botón de añadir y cierre de sesión |

## 4. Mocks y dobles de prueba

| Técnica | Dónde y para qué |
|---|---|
| `vi.fn()` | Funciones de devolución de llamada (`onCambio`, `onConfirmar`, `onCancelar`, `aplicar`, `alEnviar`, `onCerrar`) para comprobar que se llaman y con qué argumentos; también `eliminar` en `useEliminacion` con `mockReturnValue` para simular éxito y rechazo |
| `vi.spyOn(console, "error")` | Silencia y verifica el registro de errores cuando el almacenamiento está corrupto (`coleccion`, `sesion`, `carrito`) |
| `vi.spyOn(Storage.prototype, "setItem" / "getItem" / "removeItem")` | Simula `sessionStorage` o `localStorage` bloqueado o sin cuota, para cubrir las ramas de error de los contextos y de `crearColeccion` |
| `vi.useFakeTimers()` + `vi.setSystemTime()` | Fija la fecha en `crearOrden` para comprobar la fecha y el número correlativo `ORD-2026-NNNN` |
| Dependencias inyectadas | `buscar`, `productosDe`, `admisibles`, `nombreDeCategoria` y `ahora` se pasan por parámetro con valores de prueba, sin mockear módulos |
| Almacenamiento real de jsdom | Los proveedores corren de verdad sobre `sessionStorage` / `localStorage`, que se limpian en `beforeEach` con `limpiarAlmacenamiento()` |
| Eventos falsos | `useFormulario.enviar` recibe un evento con `preventDefault: vi.fn()` y un formulario falso que registra el enfoque del primer campo inválido |

## 5. Inventario de pruebas

**Total: 470 pruebas en 46 archivos.**

### 5.1 Lógica y utilidades (`logic/`, `utils/`) — 211 pruebas

| Archivo | Pruebas | Qué verifica |
|---|---:|---|
| `logic/precios.test.js` | 9 | Porcentaje de descuento (vacío, inválido, tope de 90 %), oferta, precio vigente con redondeo |
| `logic/stock.test.js` | 8 | Umbral de stock crítico (vacío, igual, cero), faltante, orden de urgencia sin mutar la lista |
| `logic/busqueda.test.js` | 7 | Normalización de tildes y mayúsculas; búsqueda de todas las palabras en varios campos |
| `logic/pago.test.js` | 13 | Formato de tarjeta y vencimiento, medio de pago sin número completo, las tres tarjetas de prueba y monto inválido |
| `logic/checkout.test.js` | 12 | Costo de envío (gratis desde $200.000, retiro, desconocida), consolidación por SKU, faltantes de stock |
| `logic/ordenes.test.js` | 15 | Subtotal, desglose de IVA (neto + IVA = total), numeración correlativa, quién puede ver una orden, orden de más reciente a más antigua |
| `logic/carrito.test.js` | 30 | Normalización contra el stock, agregar (tope, sin stock, inexistente), armado todo-o-nada, cambiar cantidad, eliminar |
| `logic/catalogo.test.js` | 20 | Lectura y escritura de criterios en la URL, filtros por categoría, oferta, stock, precio vigente y texto, los 5 órdenes |
| `logic/armado.test.js` | 21 | Reductor del asistente (modo, registrar, omitir, volver, finalizar…), cuándo se puede agregar, opciones por compatibilidad |
| `logic/reportes.test.js` | 16 | Filtro por fecha, resumen de ventas, ventas por mes y categoría, ranking de productos y clientes, valor del inventario |
| `utils/validaciones.test.js` | 48 | RUN (módulo 11, K y 0), Luhn, cada regla (`requerido`, `correo`, `contrasena`, `tarjeta`, `vencimiento`, `cvv`…), `validar`, sugerencias de correo |
| `utils/formato.test.js` | 12 | Pesos chilenos, "Gratis", fechas, mes legible, singular y plural |

### 5.2 Datos, contextos y hooks — 99 pruebas

| Archivo | Pruebas | Qué verifica |
|---|---:|---|
| `data/coleccion.test.js` | 12 | CRUD genérico, copia de la semilla, clave compuesta, JSON corrupto, almacenamiento sin cuota |
| `data/datos.test.js` | 41 | CRUD de productos, usuarios y categorías con sus reglas de integridad; `crearOrden` (stock, número, envío, rechazos sin efectos secundarios) |
| `context/sesion.test.js` | 7 | Lectura de sesión (válida, incompleta, corrupta), inicio por rol, destino seguro contra redirecciones a otros sitios |
| `context/carrito.test.js` | 8 | Lectura y escritura en `localStorage`, contenido corrupto, almacenamiento bloqueado, uso fuera del proveedor |
| `context/SesionProvider.test.jsx` | 12 | Iniciar (mensaje genérico, sin guardar la contraseña), cerrar sin tocar el carrito, actualizar sin cambiar RUN ni rol |
| `hooks/useFormulario.test.js` | 11 | Valores, validación al escribir y al salir del campo, envío con errores y válido, reinicio |
| `hooks/useEliminacion.test.js` | 5 | Pedir, cancelar y confirmar con aviso de éxito o rechazo |
| `hooks/useCriterios.test.jsx` | 3 | Criterios leídos de la URL y reemplazo con `aplicar` |

### 5.3 Componentes — 80 pruebas

| Archivo | Pruebas | Tipo principal |
|---|---:|---|
| `Alerta.test.jsx` | 6 | Props, condicional |
| `Campo.test.jsx` | 12 | Props, condicional |
| `CampoCorreo.test.jsx` | 2 | Props |
| `EstadoVacio.test.jsx` / `Indicador.test.jsx` | 1 / 1 | Renderizado |
| `ImagenProducto.test.jsx` | 4 | Props, condicional |
| `PrecioProducto.test.jsx` | 4 | Condicional |
| `Toasts.test.jsx` | 3 | Condicional, eventos |
| `CajaBusqueda.test.jsx` | 6 | Props, estado, eventos |
| `ModalConfirmacion.test.jsx` | 9 | Condicional, eventos (clic, Escape, fondo), foco |
| `BotonAgregar.test.jsx` | 5 | Condicional, estado, eventos |
| `TarjetaProducto.test.jsx` | 6 | Renderizado, props |
| `RejillaProductos.test.jsx` | 2 | Renderizado de lista, estado vacío |
| `FiltrosCatalogo.test.jsx` | 11 | Estado, eventos, condicional |
| `RutaProtegida.test.jsx` | 4 | Redirección, acceso denegado, acceso permitido |
| `layout/Header.test.jsx` | 4 | Condicional por rol, cierre de sesión |

### 5.4 Páginas y flujos — 80 pruebas

| Archivo | Pruebas | Flujo |
|---|---:|---|
| `App.test.jsx` | 2 | Ruta inicial y página no encontrada |
| `pages/Login.test.jsx` | 11 | Errores, credenciales inválidas, redirección por rol y a la vista pedida, destino hostil ignorado |
| `pages/Registro.test.jsx` | 6 | Campos obligatorios, RUN, correo y contraseña inválidos |
| `pages/Contacto.test.jsx` | 4 | Validación y envío correcto con limpieza del formulario |
| `pages/Productos.test.jsx` | 9 | Catálogo, búsqueda, categoría, filtros desde el formulario, limpiar |
| `pages/Ofertas.test.jsx` | 5 | Solo productos con descuento, orden, sin ofertas |
| `pages/Producto.test.jsx` | 9 | Ficha, producto inexistente, alerta de stock, video opcional, añadir al carrito |
| `pages/Carrito.test.jsx` | 9 | Carrito vacío, cantidad, tope de stock, eliminar, armados |
| `pages/Checkout.test.jsx` | 15 | Datos de la cuenta, envío, pago aprobado, tarjeta rechazada, sin fondos, stock cambiado, pedido sin costo |
| `pages/admin/Productos.test.jsx` | 10 | Listado, solo lectura, búsqueda, stock crítico, eliminar con confirmación |

## 6. Resultados de cobertura

Resultado de `npm run coverage`, con 46 archivos de prueba y 470 pruebas en verde:

| Carpeta | Sentencias | Ramas | Funciones | Líneas |
|---|---:|---:|---:|---:|
| **Todo `src/`** | **73,63 %** | **62,77 %** | **71,90 %** | **72,65 %** |
| `logic/` | 99,66 % | 95,51 % | 100 % | 100 % |
| `utils/` | 98,55 % | 90,41 % | 100 % | 100 % |
| `data/` | 96,51 % | 97,01 % | 89,65 % | 99,18 % |
| `hooks/` | 100 % | 77,27 % | 100 % | 100 % |
| `context/` | 91,33 % | 89,74 % | 82,22 % | 95,95 % |
| `components/` | 82,60 % | 65,54 % | 81,13 % | 81,00 % |
| `components/layout/` | 55,55 % | 36,36 % | 44,44 % | 62,50 % |
| `pages/` | 48,41 % | 33,62 % | 43,47 % | 50,00 % |
| `pages/admin/` | 15,00 % | 13,71 % | 9,52 % | 15,33 % |

Archivos clave de la rúbrica con cobertura alta: `Checkout.jsx` (96,82 % de
líneas), `Carrito.jsx`, `Producto.jsx`, `Ofertas.jsx` y `admin/Productos.jsx`
(100 %), `datos.js` (99,03 %) y todo `logic/`. La tabla de consola solo lista
los archivos con alguna línea sin cubrir; el detalle por línea está en
`coverage/index.html`.

### Control de calidad de las propias pruebas

Se verificó que las pruebas detectan errores: al cambiar `Math.round` por
`Math.floor` en `logic/precios.js`, una prueba de componente falló, pero la
prueba unitaria de la función no. Esa prueba no discriminaba (`999 × 0,9 =
899,1` da lo mismo con ambos redondeos), así que se agregó el caso `995 × 0,9 =
895,5`, que sí falla con el cambio. Además, la suite pasa con el orden de
ejecución aleatorio (`--sequence.shuffle`, dos corridas), sin advertencias de
`act(...)` ni errores inesperados en consola.

## 7. Lo que no está cubierto y por qué

| Área | Estado | Motivo y riesgo |
|---|---|---|
| `pages/Armado.jsx` (asistente de armado) | 0 % | La lógica del asistente sí está probada (`logic/armado.js`, 21 pruebas); falta la interacción de la página. Riesgo bajo |
| `pages/Perfil.jsx`, `MisCompras.jsx`, `MiCompra.jsx`, `PagoCorrecto.jsx`, `PagoError.jsx` | 0–8 % | Páginas de lectura que combinan componentes ya probados; el flujo que las alimenta (`Checkout`) sí está probado. Riesgo medio |
| `pages/admin/*` salvo `Productos` | 0–13 % | Mantenedores de usuarios y categorías, órdenes, reportes y resumen. La lógica de fondo (`datos.js`, `reportes.js`) tiene cobertura casi total |
| `components/Boleta`, `TablaOrdenes`, `TablaBarras` | 0 % | Presentación de órdenes y reportes |
| `components/layout/Nav`, `AsideAdmin`, `Layouts` | 20–55 % | Menús que dependen del rol |
| `pages/Blog`, `Blogs`, `Nosotros`, `Creditos`, `Categorias` | 0–14 % | Contenido estático o listados simples |
| Ramas de `useFormulario`, `reportes` y `FiltrosCatalogo` | 73–86 % | Combinaciones poco frecuentes de valores |

**Plan de mejora, en orden de retorno:** formularios de usuario y producto del
panel (validación y guardado), `Perfil`, `PagoCorrecto` / `PagoError`, y el
listado de `MisCompras`.

## 8. Trazabilidad con los requisitos

Los requisitos se citan como en los comentarios del código y en el ERS.

| Requisito | Pruebas que lo verifican |
|---|---|
| RF-01 Registro de usuario | `Registro.test.jsx`, `validaciones.test.js` (RUN, correo, contraseña), `datos.test.js` (RUN y correo únicos) |
| RF-02 Inicio de sesión | `Login.test.jsx`, `SesionProvider.test.jsx`, `sesion.test.js` |
| RF-03 Catálogo, filtros y búsqueda | `Productos.test.jsx`, `catalogo.test.js`, `busqueda.test.js`, `RejillaProductos.test.jsx`, `FiltrosCatalogo.test.jsx` |
| RF-04 Detalle de producto | `Producto.test.jsx` |
| RF-05 / RF-06 Carrito | `carrito.test.js` (lógica y almacenamiento), `Carrito.test.jsx`, `BotonAgregar.test.jsx` |
| RF-07 Asistente de armado | `armado.test.js` |
| RF-08 Contacto | `Contacto.test.jsx` |
| RF-10 Mantenedor de productos | `datos.test.js`, `admin/Productos.test.jsx`, `stock.test.js`, `useEliminacion.test.js` |
| RF-12 Administrador logístico (solo lectura) | `admin/Productos.test.jsx`, `RutaProtegida.test.jsx` |
| RF-13 Cierre de sesión | `Header.test.jsx`, `SesionProvider.test.jsx` |
| Checkout, pago simulado y órdenes | `Checkout.test.jsx`, `pago.test.js`, `checkout.test.js`, `ordenes.test.js`, `datos.test.js` (`crearOrden`) |
| Reportes | `reportes.test.js` |
| RNF-02 Validación y control de acceso | `validaciones.test.js`, `useFormulario.test.js`, `RutaProtegida.test.jsx` |
| RNF-03 Tolerancia a datos corruptos | `coleccion.test.js`, `carrito.test.js`, `sesion.test.js` |
