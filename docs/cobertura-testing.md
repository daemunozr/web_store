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
| Archivos de prueba | 1 | **81** |
| Pruebas | 2 | **739** (todas pasan) |
| Sentencias | 17,14 % | **98,92 %** |
| Ramas | 4,94 % | **94,49 %** |
| Funciones | 13,35 % | **98,62 %** |
| Líneas | 19,42 % | **99,51 %** |

Toda vista, componente, regla de negocio y hook tiene al menos un archivo de
prueba. Lo que queda sin cubrir son ramas de error difíciles de provocar y dos
funciones de los proveedores (sección 7).

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
   (`src/testUtils.jsx`) dentro de un `MemoryRouter`: todas las vistas de la
   tienda (inicio de sesión, registro, catálogo con filtros, asistente de
   armado, carrito, checkout con pago aprobado y rechazado, perfil e historial
   de compras) y todas las del panel (mantenedores de productos, usuarios y
   categorías con sus formularios y confirmaciones de borrado, órdenes,
   críticos, resumen y reportes). Las rutas se montan con sus parámetros reales
   (`/productos/:sku`, `/admin/usuarios/:run/editar`…) y las vistas
   restringidas se prueban con la sesión de cada rol.

### Correspondencia con las pruebas propuestas en el Anexo 1

| Tipo de prueba del Anexo 1 | Ejemplos en el proyecto |
|---|---|
| **Renderizado correcto** | `RejillaProductos` muestra una tarjeta por producto; `Productos` muestra todo el catálogo; `Producto` muestra la ficha completa; `Boleta` desglosa neto e IVA; `Reportes` calcula las cifras del periodo |
| **Renderizado condicional** | `ZonaAviso` solo muestra la alerta si hay aviso; `Campo` muestra error y sugerencia solo si vienen; `ModalConfirmacion` no existe cerrado; `Checkout` oculta la tarjeta en un pedido sin costo; el panel de productos oculta las acciones al rol logístico; `AsideAdmin` no renderiza las opciones que el rol no tiene; `Criticos` solo ofrece editar al administrador |
| **Propiedades (props)** | `Alerta` aplica `alert-{tipo}`; `Campo` liga etiqueta e id y propaga `aria-invalid` según `estado`; `TarjetaProducto` usa `nivel` para el encabezado; `PrecioProducto` respeta `mostrarGratis` |
| **Estado (state)** | `useFormulario` cambia valores y errores al escribir; `CajaBusqueda` con estado conserva el texto y actualiza el conteo; el carrito actualiza el total al cambiar la cantidad; el asistente de armado avanza, vuelve y reinicia; `Reportes` recalcula al cambiar el periodo |
| **Eventos** | `userEvent.type`, `click`, `selectOptions` y `keyboard` en formularios, filtros, modal (Escape, clic en el fondo), botón de añadir, cierre de sesión, búsqueda del menú y botón de impresión de la boleta |

## 4. Mocks y dobles de prueba

| Técnica | Dónde y para qué |
|---|---|
| `vi.fn()` | Funciones de devolución de llamada (`onCambio`, `onConfirmar`, `onCancelar`, `aplicar`, `alEnviar`, `onCerrar`) para comprobar que se llaman y con qué argumentos; también `eliminar` en `useEliminacion` con `mockReturnValue` para simular éxito y rechazo |
| `vi.spyOn(window, "print")` | Comprueba que «Imprimir boleta» abre el diálogo de impresión sin abrirlo de verdad |
| `vi.spyOn(console, "error")` | Silencia y verifica el registro de errores cuando el almacenamiento está corrupto (`coleccion`, `sesion`, `carrito`) |
| `vi.spyOn(Storage.prototype, "setItem" / "getItem" / "removeItem")` | Simula `sessionStorage` o `localStorage` bloqueado o sin cuota, para cubrir las ramas de error de los contextos y de `crearColeccion` |
| `vi.useFakeTimers()` + `vi.setSystemTime()` | Fija la fecha en `crearOrden` para comprobar la fecha y el número correlativo `ORD-2026-NNNN`, y en `Footer` para comprobar el año en curso |
| Datos sembrados en `sessionStorage` | Para casos límite sin tocar el código: un producto sin stock, una categoría vacía, el stock que baja mientras el cliente decide un armado, un carrito o una lista de órdenes vacíos |
| Dependencias inyectadas | `buscar`, `productosDe`, `admisibles`, `nombreDeCategoria` y `ahora` se pasan por parámetro con valores de prueba, sin mockear módulos |
| Almacenamiento real de jsdom | Los proveedores corren de verdad sobre `sessionStorage` / `localStorage`, que se limpian en `beforeEach` con `limpiarAlmacenamiento()` |
| Eventos falsos | `useFormulario.enviar` recibe un evento con `preventDefault: vi.fn()` y un formulario falso que registra el enfoque del primer campo inválido |

## 5. Inventario de pruebas

**Total: 739 pruebas en 81 archivos.**

### 5.1 Lógica y utilidades (`logic/`, `utils/`) — 223 pruebas

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
| `utils/recursos.test.js` | 12 | Rutas externas, absolutas y relativas a `public/`; ruta vacía |

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

### 5.3 Componentes — 142 pruebas

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
| `Boleta.test.jsx` | 9 | Renderizado, condicional (despacho, invitado, medio de pago), IVA, impresión |
| `ResumenPedido.test.jsx` | 6 | Props, condicional (envío por calcular, gratis, con costo) |
| `TablaOrdenes.test.jsx` | 7 | Orden, props (`conCliente`, `rutaDetalle`, `titulo`), estado vacío |
| `TablaBarras.test.jsx` | 5 | Props, proporción de las barras, estado vacío |
| `SelectRegionComuna.test.jsx` | 6 | Estado y eventos: región → comunas, comuna descartada, validación |
| `layout/Header.test.jsx` | 4 | Condicional por rol, cierre de sesión |
| `layout/Nav.test.jsx` | 8 | Enlaces, enlace activo, contador del carrito, búsqueda, menú móvil |
| `layout/Aside.test.jsx` | 6 | Categorías del catálogo, categoría activa por URL |
| `layout/AsideAdmin.test.jsx` | 8 | Menú por rol (sin las demás opciones en el DOM), opción activa |
| `layout/Footer.test.jsx` | 4 | Contacto, enlaces, año con reloj simulado |
| `layout/Layouts.test.jsx` | 3 | Diseño de tienda con y sin barra lateral, diseño del panel |

### 5.4 Páginas y flujos — 275 pruebas

| Archivo | Pruebas | Flujo |
|---|---:|---|
| `App.test.jsx` | 2 | Ruta inicial y página no encontrada |
| `pages/Inicio.test.jsx` | 6 | Hero antes del listado, destacados y su respaldo, video después |
| `pages/Productos.test.jsx` | 9 | Catálogo, búsqueda, categoría, filtros desde el formulario, limpiar |
| `pages/Producto.test.jsx` | 9 | Ficha, producto inexistente, alerta de stock, video opcional, añadir al carrito |
| `pages/Categorias.test.jsx` | 6 | Agrupación por categoría, tres primeros, enlace «Ver los N productos», categoría vacía o nueva |
| `pages/Ofertas.test.jsx` | 5 | Solo productos con descuento, orden, sin ofertas |
| `pages/Armado.test.jsx` | 15 | Modos, un paso a la vez, filtro por compatibilidad, volver, omitir, finalizar, sin stock, recorrido completo al carrito, falta de stock al agregar |
| `pages/Carrito.test.jsx` | 9 | Carrito vacío, cantidad, tope de stock, eliminar, armados |
| `pages/Checkout.test.jsx` | 15 | Datos de la cuenta, envío, pago aprobado, tarjeta rechazada, sin fondos, stock cambiado, pedido sin costo |
| `pages/PagoCorrecto.test.jsx` | 7 | Confirmación con boleta, dueño, personal, invitado y «Orden no encontrada» |
| `pages/PagoError.test.jsx` | 8 | Motivo, carrito intacto, envío según la entrega, reintentar, carrito vacío |
| `pages/Login.test.jsx` | 11 | Errores, credenciales inválidas, redirección por rol y a la vista pedida, destino hostil ignorado |
| `pages/Registro.test.jsx` | 10 | Campos obligatorios, RUN, correo y contraseña inválidos, alta como Cliente, RUN y correo repetidos |
| `pages/Perfil.test.jsx` | 17 | Datos de solo lectura, guardar, correo repetido, región → comuna, cambio de contraseña (4 rechazos y el éxito), vista del panel |
| `pages/MisCompras.test.jsx` | 5 | Compras de la cuenta de la más reciente a la más antigua, resumen, singular, vacío |
| `pages/MiCompra.test.jsx` | 4 | Boleta propia; ajena, de invitado e inexistente como «Orden no encontrada» |
| `pages/Contacto.test.jsx` | 4 | Validación y envío correcto con limpieza del formulario |
| `pages/Blogs.test.jsx` / `Blog.test.jsx` | 3 / 4 | Listado, detalle, artículo inexistente |
| `pages/Nosotros.test.jsx` / `Creditos.test.jsx` / `NoEncontrada.test.jsx` | 3 / 4 / 2 | Contenido institucional, tabla de créditos, ruta inexistente |
| `pages/admin/Productos.test.jsx` | 10 | Listado, solo lectura, búsqueda, stock crítico, eliminar con confirmación |
| `pages/admin/FormularioProducto.test.jsx` | 17 | Crear y editar; SKU, precio, descuento 0–90, stock; precio final; SKU repetido |
| `pages/admin/Usuarios.test.jsx` | 10 | Listado, búsqueda, cuenta propia, eliminar (con órdenes se rechaza) |
| `pages/admin/Usuario.test.jsx` | 6 | Ficha sin contraseña, historial de compras, RUN inexistente |
| `pages/admin/FormularioUsuario.test.jsx` | 13 | Reglas de RF-01, tipo de usuario, RUN y correo repetidos, edición |
| `pages/admin/Categorias.test.jsx` | 9 | Listado, eliminar (paso del asistente y con productos se rechazan) |
| `pages/admin/FormularioCategoria.test.jsx` | 15 | Código 3–30 en minúsculas, números y guiones, único e inmutable, nombre |
| `pages/admin/Criticos.test.jsx` | 10 | Orden de urgencia, columnas, acceso a la ficha solo del administrador |
| `pages/admin/Ordenes.test.jsx` | 7 | Listado en solo lectura, búsqueda por número, cliente, correo y producto |
| `pages/admin/Orden.test.jsx` | 4 | Boleta en solo lectura, invitado, inexistente |
| `pages/admin/Resumen.test.jsx` | 3 | Indicadores y accesos |
| `pages/admin/Reportes.test.jsx` | 13 | Resumen, ventas por mes y categoría, ranking, inventario, periodo (inclusivo, invertido, vacío) |

## 6. Resultados de cobertura

Resultado de `npm run coverage`, con 81 archivos de prueba y 739 pruebas en verde:

| Carpeta | Sentencias | Ramas | Funciones | Líneas |
|---|---:|---:|---:|---:|
| **Todo `src/`** | **98,92 %** | **94,49 %** | **98,62 %** | **99,51 %** |
| `logic/` | 99,66 % | 97,14 % | 100 % | 100 % |
| `utils/` | 100 % | 91,78 % | 100 % | 100 % |
| `data/` | 99,42 % | 97,01 % | 98,28 % | 99,19 % |
| `hooks/` | 100 % | 86,36 % | 100 % | 100 % |
| `context/` | 92,91 % | 97,44 % | 86,67 % | 97,98 % |
| `components/` | 100 % | 96,64 % | 100 % | 100 % |
| `components/layout/` | 100 % | 96,97 % | 100 % | 100 % |
| `pages/` | 98,56 % | 91,15 % | 100 % | 99,05 % |
| `pages/admin/` | 100 % | 94,86 % | 100 % | 100 % |

La tabla de consola solo lista los archivos con alguna línea o rama sin cubrir;
el detalle por línea está en `coverage/index.html`.

### Control de calidad de las propias pruebas

Se verificó que las pruebas detectan errores: al cambiar `Math.round` por
`Math.floor` en `logic/precios.js`, una prueba de componente falló, pero la
prueba unitaria de la función no. Esa prueba no discriminaba (`999 × 0,9 =
899,1` da lo mismo con ambos redondeos), así que se agregó el caso `995 × 0,9 =
895,5`, que sí falla con el cambio. Además, la suite pasa con el orden de
ejecución aleatorio (`--sequence.shuffle`, dos corridas), sin advertencias de
`act(...)` ni errores inesperados en consola.

## 7. Lo que no está cubierto y por qué

Ninguna vista ni componente queda en 0 %. Lo que falta es poco y de bajo riesgo:

| Área | Estado | Motivo y riesgo |
|---|---|---|
| `context/CarritoProvider.jsx` (funciones) y `SesionProvider.jsx` (líneas 43 y 59) | 77 % de funciones en el carrito | Operaciones secundarias de los proveedores que ninguna vista ejerce en las pruebas; el resto de cada proveedor corre de verdad en todas las pruebas de vistas. Riesgo bajo |
| `pages/Checkout.jsx` (líneas 145-146) | 2 líneas | Rechazo de `crearOrden` por la capa de datos después de que la vista ya validó el stock; la regla sí está probada en `datos.test.js`. Riesgo bajo |
| `pages/Armado.jsx` (línea 279) | 1 línea | Mensaje de un recorrido completo sin ningún componente elegido, un estado que la interfaz no deja alcanzar. Riesgo bajo |
| `pages/Perfil.jsx` (ramas) | 82,6 % de ramas | Valores opcionales que la semilla siempre trae (fecha de nacimiento, comuna) y el rechazo del cambio de contraseña por la capa de datos. Riesgo bajo |
| Ramas de `hooks/` y `utils/` | 86–92 % | `useFormulario` con campos sin definición y reglas con entradas no numéricas |
| `main.jsx`, `semillas.js`, `creditos.js` | Excluidos | Arranque de la aplicación y datos de ejemplo, sin lógica propia |
| Pruebas de extremo a extremo en un navegador real | No hay | Fuera del alcance de la pauta (pruebas unitarias); las vistas se prueban en jsdom |

**Lo que las pruebas no demuestran:** aspecto visual, impresión real de la boleta,
reproducción del video, comportamiento responsivo ni accesibilidad más allá de
los roles y nombres que consultan las propias pruebas. Esos puntos se revisan a
mano con `npm run dev`.

## 8. Trazabilidad con los requisitos

Los requisitos se citan como en los comentarios del código y en el ERS.

| Requisito | Pruebas que lo verifican |
|---|---|
| RF-01 Registro de usuario | `Registro.test.jsx`, `validaciones.test.js` (RUN, correo, contraseña), `datos.test.js` (RUN y correo únicos) |
| RF-02 Inicio de sesión | `Login.test.jsx`, `SesionProvider.test.jsx`, `sesion.test.js` |
| RF-03 Catálogo, filtros y búsqueda | `Productos.test.jsx`, `catalogo.test.js`, `busqueda.test.js`, `RejillaProductos.test.jsx`, `FiltrosCatalogo.test.jsx` |
| RF-04 Detalle de producto | `Producto.test.jsx` |
| RF-05 / RF-06 Carrito | `carrito.test.js` (lógica y almacenamiento), `Carrito.test.jsx`, `BotonAgregar.test.jsx` |
| RF-07 Asistente de armado | `armado.test.js`, `Armado.test.jsx` |
| RF-08 Contacto | `Contacto.test.jsx` |
| RF-09 Blogs | `Blogs.test.jsx`, `Blog.test.jsx` |
| RF-10 Mantenedor de productos | `datos.test.js`, `admin/Productos.test.jsx`, `admin/FormularioProducto.test.jsx`, `stock.test.js`, `useEliminacion.test.js` |
| RF-11 Mantenedor de usuarios | `admin/Usuarios.test.jsx`, `admin/Usuario.test.jsx`, `admin/FormularioUsuario.test.jsx`, `datos.test.js` |
| RF-12 Administrador logístico (solo lectura) | `admin/Productos.test.jsx`, `admin/Ordenes.test.jsx`, `admin/Orden.test.jsx`, `AsideAdmin.test.jsx`, `RutaProtegida.test.jsx` |
| RF-13 Cierre de sesión | `Header.test.jsx`, `SesionProvider.test.jsx` |
| RF-14 Navegación | `Nav.test.jsx`, `Aside.test.jsx`, `Footer.test.jsx`, `Layouts.test.jsx` |
| RF-15 Nosotros | `Nosotros.test.jsx` |
| RF-17 Buscar y filtrar | `Productos.test.jsx`, `FiltrosCatalogo.test.jsx`, `catalogo.test.js`, `busqueda.test.js`, `useCriterios.test.jsx` |
| RF-18 Ofertas y precio vigente | `Ofertas.test.jsx`, `precios.test.js`, `PrecioProducto.test.jsx`, `FormularioProducto.test.jsx` |
| RF-19 Productos por categoría | `Categorias.test.jsx`, `Aside.test.jsx` |
| RF-20 / RF-21 Pago y su resultado | `Checkout.test.jsx`, `PagoCorrecto.test.jsx`, `PagoError.test.jsx`, `pago.test.js`, `checkout.test.js` |
| RF-22 Orden y boleta | `Boleta.test.jsx`, `ordenes.test.js`, `datos.test.js` (`crearOrden`) |
| RF-23 Perfil | `Perfil.test.jsx` |
| RF-24 Historial de compras | `MisCompras.test.jsx`, `MiCompra.test.jsx`, `TablaOrdenes.test.jsx` |
| RF-25 Mantenedor de categorías | `admin/Categorias.test.jsx`, `admin/FormularioCategoria.test.jsx`, `datos.test.js` |
| RF-26 Productos críticos | `admin/Criticos.test.jsx`, `stock.test.js` |
| RF-27 Reportes | `admin/Reportes.test.jsx`, `TablaBarras.test.jsx`, `reportes.test.js` |
| RNF-02 Validación y control de acceso | `validaciones.test.js`, `useFormulario.test.js`, `RutaProtegida.test.jsx`, `AsideAdmin.test.jsx`, `Perfil.test.jsx` (campos de contraseña) |
| RNF-03 Tolerancia a datos corruptos | `coleccion.test.js`, `carrito.test.js`, `sesion.test.js` |
