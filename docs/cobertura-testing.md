# Documento de cobertura de testing

**Proyecto:** Ensambla.me — Tienda online de componentes de PC
**Asignatura:** DSY1104 Desarrollo Fullstack II · Evaluación Parcial N° 2
**Autor:** Daniel Muñoz
**Fecha de medición:** 29-10-2026 (Vitest 5.0.5, cobertura v8)

Este documento valida el alcance de los elementos cubiertos por las pruebas
unitarias del frontend (React + Vite), reemplazando Jasmine y Karma por Vitest
según lo indicado para la evaluación. Todas las cifras salen de ejecutar
`npm run coverage` sobre el código entregado.

## 1. Resumen

| Métrica | Valor |
|---|---:|
| Archivos de prueba | **10** |
| Pruebas | **10** (todas pasan) |
| Sentencias | 34,83 % |
| Ramas | 22,38 % |
| Funciones | 36,34 % |
| Líneas | 36,00 % |

La suite son diez pruebas unitarias, cada una sobre un componente, hook o página
distinto, elegidas para cubrir los cuatro tipos del Anexo 1 (renderizado, props,
estado y eventos) y el uso de un mock de módulo. La cobertura global es baja
porque el porcentaje se calcula sobre todo `src/` y estas pruebas no recorren las
demás vistas, la capa de datos ni la lógica de negocio (sección 7).

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
(`semillas.js`, `creditos.js`) y las propias pruebas. No hay umbrales mínimos
(`coverage.thresholds`): la cobertura se reporta, no se exige.

```
npm run test:run   # una pasada de todas las pruebas
npm test           # modo watch
npm run coverage   # cobertura: tabla en consola + coverage/index.html
```

## 3. Estrategia

Las pruebas van junto al archivo que prueban (`foo.jsx` → `foo.test.jsx`) y hay
una por cada elemento:

1. **Componentes** (7): `Alerta`, `Campo`, `ModalConfirmacion`, `CajaBusqueda`,
   `FiltrosCatalogo`, `TarjetaProducto` y `Boleta`, aislados, con sus props,
   estados y eventos.
2. **Hook** (1): `useFormulario`, con `renderHook` de Testing Library.
3. **Páginas** (2): `Carrito` y `Checkout`, montadas con los proveedores reales
   (`src/testUtils.jsx`) dentro de un `MemoryRouter`. `Checkout` se prueba con
   la pasarela de pago mockeada.

### Correspondencia con las pruebas propuestas en el Anexo 1

| Tipo de prueba del Anexo 1 | Ejemplos en el proyecto |
|---|---|
| **Renderizado correcto** | `TarjetaProducto` muestra nombre, categoría y precio; `Boleta` desglosa neto e IVA y suma el envío |
| **Renderizado condicional** | `Campo` muestra el error y la sugerencia solo cuando vienen |
| **Propiedades (props)** | `Alerta` aplica la clase `alert-{tipo}` recibida en la prop `tipo` |
| **Estado (state)** | `CajaBusqueda` con estado conserva el texto y actualiza el conteo; `useFormulario` guarda el valor y valida al escribir; `Carrito` actualiza el total al cambiar la cantidad |
| **Eventos** | `ModalConfirmacion` llama a `onConfirmar` al hacer clic; `FiltrosCatalogo` no aplica el filtro hasta enviar el formulario |

## 4. Mocks y dobles de prueba

| Técnica | Dónde y para qué |
|---|---|
| `vi.mock(modulo, importOriginal)` | En `Checkout.mocks.test.jsx`: reemplaza `autorizarPago` (`logic/pago.js`) por un `vi.fn()` que conserva la implementación real por defecto. Permite aprobar el pago sin depender de tarjetas especiales y comprobar con qué monto y tarjeta se cobra |
| `vi.fn()` | Funciones de devolución de llamada (`onConfirmar`, `onCancelar`, `aplicar`) para comprobar que se llaman y con qué argumentos |
| Almacenamiento real de jsdom | `Carrito`, `Checkout`, `TarjetaProducto` y `Boleta` corren sobre `sessionStorage` / `localStorage` reales, que se limpian en `beforeEach` con `limpiarAlmacenamiento()` |

## 5. Inventario de pruebas

**Total: 10 pruebas en 10 archivos.**

| # | Archivo | Tipo de prueba | Qué verifica |
|---:|---|---|---|
| 1 | `components/Alerta.test.jsx` | Props | Usa el tipo recibido en la clase de Bootstrap |
| 2 | `components/Campo.test.jsx` | Renderizado condicional | Muestra el error y la sugerencia solo cuando vienen |
| 3 | `components/ModalConfirmacion.test.jsx` | Eventos | Confirmar llama a `onConfirmar` y no a `onCancelar` |
| 4 | `components/CajaBusqueda.test.jsx` | Estado | El texto escrito se conserva y actualiza el conteo |
| 5 | `components/FiltrosCatalogo.test.jsx` | Eventos | Escribir no aplica el filtro hasta enviar el formulario |
| 6 | `components/TarjetaProducto.test.jsx` | Renderizado | Muestra nombre, categoría y precio del producto |
| 7 | `components/Boleta.test.jsx` | Renderizado | El total incluye el envío y desglosa neto e IVA del 19 % |
| 8 | `hooks/useFormulario.test.js` | Estado | `onChange` guarda el valor y valida el campo al escribir |
| 9 | `pages/Carrito.test.jsx` | Estado y eventos | Cambiar la cantidad actualiza el total y lo guarda |
| 10 | `pages/Checkout.mocks.test.jsx` | Mock de módulo | Cobra a la pasarela mockeada el total con envío y la tarjeta escrita |

## 6. Resultados de cobertura

Resultado de `npm run coverage`, con 10 archivos de prueba y 10 pruebas en verde:

| Carpeta | Sentencias | Ramas | Funciones | Líneas |
|---|---:|---:|---:|---:|
| **Todo `src/`** | **34,83 %** | **22,38 %** | **36,34 %** | **36,00 %** |
| `components/` | 61,73 % | 52,94 % | 64,15 % | 61,00 % |
| `hooks/` | 61,66 % | 50,00 % | 58,33 % | 62,22 % |
| `context/` | 55,90 % | 41,02 % | 53,33 % | 61,61 % |
| `utils/` | 53,62 % | 38,35 % | 66,66 % | 60,37 % |
| `data/` | 47,09 % | 25,37 % | 41,37 % | 52,03 % |
| `logic/` | 35,69 % | 21,22 % | 37,50 % | 39,47 % |
| `pages/` | 22,47 % | 11,06 % | 20,65 % | 23,10 % |
| `components/layout/`, `pages/admin/` | 0 % | 0 % | 0 % | 0 % |

El detalle por línea está en `coverage/index.html`.

## 7. Lo que no está cubierto

| Área | Estado |
|---|---|
| `pages/admin/` | Sin pruebas (0 %): panel de administración completo |
| `pages/` salvo `Carrito` y `Checkout` | Sin pruebas (y `Checkout` solo su camino de pago aprobado): inicio, catálogo, ficha de producto, registro, inicio de sesión, perfil, armado, blogs, contacto, ofertas, categorías y pago correcto o con error |
| `data/` y `logic/` | Cubiertas solo de forma indirecta por las pruebas de `Carrito` y `Checkout`: no hay pruebas directas de CRUD, reglas de integridad, precios, stock, reportes ni armado |
| `components/layout/` | Sin pruebas (0 %) |
| `context/` | Cubierto solo de forma indirecta por `Carrito` y `Checkout` |
| `main.jsx`, `semillas.js`, `creditos.js` | Excluidos: arranque de la aplicación y datos de ejemplo, sin lógica propia |

**Lo que las pruebas no demuestran:** aspecto visual, impresión real de la boleta,
reproducción del video ni accesibilidad más allá de los roles y nombres que
consultan las propias pruebas. El ancho real del diseño responsivo se revisó a
mano con `npm run dev`: está en [`responsividad.md`](responsividad.md).
