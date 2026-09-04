# Pagina web para tienda electronica

**Autor**: Daniel Muñoz

**Ultima modificacion:** 03-09-2026

## Descripcion

Pagina web con pagina de estilos css y script utilizando bootstrap.js

## Requerimientos
1. index.html debe hacer referencia a archivos destinados para cada etiqueta (header, footer, aside, etc), y en esos archivos se debe escribir el contenido especifico de dicha seccion. Para referencias archivos, se debe utilizar bootstrap.
2. CSS y JS con Bootstap.
...

## Instrucciones de la Evaluacion 1 (30%)

Enunciado del proyecto: construir una **tienda online basica** con HTML, CSS y JavaScript
puro. Es la base para evaluaciones futuras.

**Entregables requeridos:**

- **HTML:** estructura semantica — secciones, encabezados, parrafos, listas.
- **Navegacion:** hipervinculos entre paginas, imagenes, botones, menus + barras
  laterales, formularios.
- **CSS:** una hoja de estilos externa, propia y responsiva; consistente en todas las
  paginas.
- **Validacion JS:** validacion de formularios en tiempo real con mensajes de error y
  sugerencias personalizados.
- **Git/GitHub:** repo publico, commits claros, reparto equitativo de tareas.

**Dos areas a construir:**

*Tienda (publica):*

| Vista | Contenido clave |
|---|---|
| Home | menu de navegacion con logo + carrito, componente hero, lista de productos (imagen/nombre/precio), footer |
| Registro de usuario | formulario de registro (mismas reglas que "crear usuario" del admin) |
| Login | logo + nombre, formulario de inicio de sesion |
| Nosotros | descripcion de la empresa + desarrolladores |
| Blogs + 2 detalles de blog | imagen, titulo, descripcion corta/larga |
| Contacto | formulario de mensajes interno |
| Productos + Detalle producto | lista (imagen, nombre, precio, boton agregar); click -> detalle; carrito funcional |

*Admin (protegido con autenticacion):*

- Home con menu vertical visible (diseno libre por lo demas).
- Mantenedores (CRUD) para **Producto** y **Usuario** — listado + crear/editar.

**Reglas de validacion JS (detalle):**

- **Email login:** requerido, max 100, solo `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`.
- **Password:** requerido, 4–10 caracteres.
- **Contacto:** nombre requerido/max 100; email max 100 + regla de dominio; comentario
  requerido/max 500.
- **Producto:** codigo (requerido, texto, min 3); nombre (req, max 100); descripcion (opc,
  max 500); precio (req, min 0, admite decimales); stock (req, min 0, enteros); stock
  critico (opc, entero); categoria (req, select); imagen (opc).
- **Usuario:** RUN (requerido, valido, sin puntos ni guion ej. `19011022K`, min 7 max 9);
  nombre (req, max 50); apellidos (req, max 100); email (req, max 100 + regla de dominio);
  fecha nacimiento (opc); tipo usuario select (Administrador/Cliente/Vendedor); region +
  comuna (desde arreglos JS, la comuna se actualiza al cambiar la region); direccion (req,
  max 300).
- **Carrito:** arreglo de productos en JS, render desde el arreglo, agregar al carrito,
  definir reglas del carrito, persistir en **localStorage**.

**Roles:** Administrador (acceso total); Vendedor (solo ver productos + ordenes); Cliente
(solo tienda).

**Entrega I:** enlace publico de GitHub + frontend comprimido + documento ERS v1.
Presentacion: 15 min + 5 min de preguntas por equipo; cada integrante responde preguntas
abiertas.

## Plantilla ERS (IEEE 830)

Plantilla en blanco de **Especificacion de Requisitos de Software** para completar:
registro del documento, 1. Introduccion (proposito, ambito, definiciones, referencias),
2. Descripcion general (perspectiva del producto, funciones, caracteristicas de usuarios,
restricciones, suposiciones, requisitos futuros), 3. Requisitos especificos (interfaces,
requisitos funcionales como fichas de caso de uso, no funcionales:
rendimiento/seguridad/fiabilidad/disponibilidad/mantenibilidad/portabilidad). Solo
contiene texto guia y un ejemplo residual de restaurante ("Crear pedido", actor: Garzon)
que hay que reemplazar por los requisitos de la tienda.

## Guia de columnas de la planilla de requerimientos

Define las columnas de la hoja de seguimiento de requerimientos: `[Nombre del
Requerimiento]`, `Tipo Requerimiento [Funcional/No Funcional]`, `Clasificacion`, `Actores
Relacionados`, `[Descripcion corta]`, `Criterio de Aceptacion`, `Estado`.

