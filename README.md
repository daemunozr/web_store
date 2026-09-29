----------------------------------------------------------------------- DUOC UC
- Escuela de Informática y Telecomunicaciones
-----------------------------------------------------------------------
Especificación de Requisitos de Software

*Proyecto:* Ensambla.me – Tienda Online de Tecnología

**Revisión: 1.2**

**Autor:** Daniel Muñoz

**29-09-2026**
-----------------------------------------------------------------------

-----------------------------------------------------------------------
Especificación de Requisitos según estándar de IEEE 830.
-----------------------------------------------------------------------

# Contenido

[Ficha del documento](#ficha-del-documento)

[1. Introducción](#1-introducción)

[1.1. Propósito](#11-propósito)

[1.2. Ámbito del Sistema](#12-ámbito-del-sistema)

[1.3. Definiciones, Acrónimos y
Abreviaturas](#13-definiciones-acrónimos-y-abreviaturas)

[1.4. Referencias](#14-referencias)

[1.5. Visión General del Documento](#15-visión-general-del-documento)

[2. Descripción General](#2-descripción-general)

[2.1. Perspectiva del Producto](#21-perspectiva-del-producto)

[2.2. Funciones del Producto](#22-funciones-del-producto)

[2.3. Características de los Usuarios](#23-características-de-los-usuarios)

[2.4. Restricciones](#24-restricciones)

[2.5. Suposiciones y Dependencias](#25-suposiciones-y-dependencias)

[2.6. Requisitos Futuros](#26-requisitos-futuros)

[3. Requisitos Específicos](#3-requisitos-específicos)

[3.1 Requisitos comunes de las
interfaces](#31-requisitos-comunes-de-las-interfaces)

[3.1.1 Interfaces de usuario](#311-interfaces-de-usuario)

[3.1.2 Interfaces de hardware](#312-interfaces-de-hardware)

[3.1.3 Interfaces de software](#313-interfaces-de-software)

[3.1.4 Interfaces de comunicación](#314-interfaces-de-comunicación)

[3.2 Requisitos funcionales](#32-requisitos-funcionales)

[3.3 Requisitos no funcionales](#33-requisitos-no-funcionales)

[3.3.1 Requisitos de rendimiento](#331-requisitos-de-rendimiento)

[3.3.2 Seguridad](#332-seguridad)

[3.3.3 Fiabilidad](#333-fiabilidad)

[3.3.4 Disponibilidad](#334-disponibilidad)

[3.3.5 Mantenibilidad](#335-mantenibilidad)

[3.3.6 Portabilidad](#336-portabilidad)

[3.4 Otros Requisitos](#34-otros-requisitos)

[3.5 Trazabilidad de requisitos](#35-trazabilidad-de-requisitos)

# Ficha del documento

| **Fecha**  | **Revisión** | **Autor**    | **Modificación**                                     |
|------------|--------------|--------------|------------------------------------------------------|
| 24-09-2026 | 1.0          | Daniel Muñoz | Versión inicial del ERS (Entrega I)                  |
| 29-09-2026 | 1.1          | Daniel Muñoz | Corrección de inconsistencias y requisitos faltantes |
| 29-09-2026 | 1.2          | Daniel Muñoz | Historias de usuario, criterios de aceptación y trazabilidad |

Documento validado por las partes en fecha: *pendiente de presentación (Entrega
I)*.

| Por el cliente               | Por la empresa suministradora |
|------------------------------|-------------------------------|
| [Firma]                      | [Firma]                       |
| Sr./Sra. — Docente evaluador | Sr./Sra. Daniel Muñoz         |

# 1. Introducción

Esta sección introduce el documento de Especificación de Requisitos de Software
(ERS) para **Ensambla.me**, tienda online de artículos tecnológicos. Consta de
las subsecciones: propósito, ámbito del sistema, definiciones, referencias y
visión general del documento.

## 1.1. Propósito

El propósito de este documento es describir de forma detallada los requisitos
funcionales y no funcionales del sitio web **Ensambla.me**, una tienda online de
productos tecnológicos que además ofrece un asistente de armado guiado de PC
gamer por componentes, en su primera versión (Entrega I de la Evaluación 1 de
la asignatura DSY1104).

El documento está dirigido al docente evaluador de la asignatura, y sirve además
como referencia interna para el desarrollador durante la construcción del sitio
y en evaluaciones futuras del mismo proyecto.

## 1.2. Ámbito del Sistema

El sistema se denomina **Ensambla.me** y consiste en un sitio web que guía al
cliente en la construcción de su PC gamer, permitiéndole escoger paso a paso los
componentes hasta completar el equipo entero o bien solo módulos específicos.

En esta primera entrega, el sistema:

- **Sí hará:** permitir la navegación pública por catálogo de productos, blogs,
  información de la empresa y contacto; permitir el registro, el inicio y el
  cierre de sesión de usuarios; permitir armar una PC gamer seleccionando
  componentes de forma guiada por categoría, ya sea el equipo completo o solo
  módulos específicos (ej. únicamente almacenamiento o únicamente
  refrigeración); permitir agregar productos y armados al carrito de compras y
  gestionarlo (eliminar ítems, modificar cantidades y ver el total); y ofrecer
  un panel administrativo protegido con mantenedores (listar/crear/editar) de
  Productos y Usuarios, más la consulta en modo solo lectura del listado y
  detalle de órdenes simuladas.
- **No hará (en esta entrega):** procesar pagos reales, conectarse a una base de
  datos o backend real, ni gestionar el ciclo completo de una orden de compra
  (despacho, facturación, etc.). Tampoco validará la compatibilidad técnica real
  entre componentes: el asistente de armado filtra las opciones de cada
  categoría a partir de una tabla de compatibilidad estática predefinida en los
  arreglos JavaScript (ver 1.3), sin calcular la adecuación real de socket de
  CPU, tipo de RAM, formato de gabinete ni potencia de la fuente de poder; el
  motor de validación real queda como requisito futuro (ver 2.6). Los datos de
  productos, usuarios y órdenes se simulan mediante arreglos de JavaScript, y el
  carrito se persiste únicamente en `localStorage` del navegador. Además, el
  sitio no funciona abierto como archivo local (`file://`): debe servirse por
  HTTP, ya que las secciones de cada página se cargan con `fetch()` (ver 3.1.4).

Los beneficios esperados son: contar con una base funcional y bien estructurada
(HTML semántico, CSS propio y responsivo, validaciones JS) que sirva de
fundamento para incorporar en evaluaciones posteriores un backend real, base de
datos y pasarela de pago.

## 1.3. Definiciones, Acrónimos y Abreviaturas

- **ERS**: Especificación de Requisitos de Software.
- **Historia de usuario**: enunciado breve, en lenguaje del cliente, con el
  formato "Como <rol>, quiero <acción> para <beneficio>", que expresa la
  motivación de un requisito funcional.
- **Criterio de aceptación**: condición verificable y objetiva que debe
  cumplirse para dar por satisfecho un requisito. Cuando describe un flujo se
  redacta en formato Dado / Cuando / Entonces.
- **RUN**: Rol Único Nacional, identificador de personas en Chile. En este
  sistema se ingresa sin puntos ni guion (ej. `19011022K`) y se valida su dígito
  verificador.
- **Dominios permitidos**: únicos dominios de correo electrónico aceptados por
  cualquier campo de correo del sistema: `@duoc.cl`, `@profesor.duoc.cl` y
  `@gmail.com`.
- **Código de producto (SKU)**: identificador de texto único de cada producto en
  el catálogo.
- **Armado (build)**: conjunto de componentes seleccionados por el cliente
  mediante el asistente de armado para configurar una PC gamer, completa o por
  módulos.
- **Módulo**: subconjunto de categorías de componentes (ej. solo almacenamiento,
  solo refrigeración) que el cliente puede armar de forma independiente sin
  construir el equipo completo.
- **Componente**: cada pieza de hardware seleccionable dentro de un armado
  (CPU, placa madre, RAM, almacenamiento, fuente de poder, gabinete,
  refrigeración, tarjeta gráfica, periféricos).
- **Tabla de compatibilidad**: estructura estática definida en los arreglos
  JavaScript que asocia cada componente con los componentes admisibles de la
  siguiente categoría (ej. socket de CPU → placas madre compatibles). Es el
  único criterio de filtrado del asistente de armado en esta entrega.
- **Carrito de compras**: estructura de datos en JavaScript que almacena los
  productos seleccionados por el cliente antes de finalizar una compra.
- **Orden**: registro simulado de una compra (cliente, fecha, productos y
  total), almacenado en un arreglo JavaScript y disponible únicamente en modo
  solo lectura en esta entrega.
- **LocalStorage**: mecanismo de almacenamiento del navegador (Web Storage API)
  usado para persistir el contenido del carrito entre sesiones.
- **Stock crítico**: cantidad mínima de unidades de un producto a partir de la
  cual el sistema debe mostrar una alerta de bajo inventario.
- **CRUD**: Crear, Leer (listar), Actualizar y Eliminar — operaciones básicas de
  un mantenedor.
- **Mantenedor**: vista administrativa que implementa las operaciones CRUD de
  una entidad (Producto o Usuario), con excepción de Eliminar, que queda fuera
  del alcance de esta entrega (ver 2.6).

## 1.4. Referencias

- Anexo 1 — Instrucciones para el desarrollo de la Evaluación 1 (30%),
  incluyendo mockups de cada vista.
- Anexo 2 — Planilla de Requerimientos (guía de columnas para el seguimiento de
  requisitos).
- Anexo 3 — Ejemplo de Planilla de Requerimientos.
- Anexo 4 — Plantilla ERS - Especificación de Requisitos del Software (IEEE
  830), base de este documento.

## 1.5. Visión General del Documento

Este documento consta de un área de definición del negocio (sección 2,
Descripción General) y un área de especificación de requisitos (sección 3,
Requisitos Específicos), donde se detallan los requisitos funcionales mediante
fichas que incluyen su historia de usuario y sus criterios de aceptación, los
requisitos no funcionales del sistema con sus propios criterios, y una tabla de
trazabilidad (sección 3.5) que relaciona todos los requisitos con los actores y
las vistas involucradas.

# 2. Descripción General

Esta sección describe los factores que afectan al producto **Ensambla.me** y a
sus requisitos, sin detallar aún los requisitos en sí (eso se hace en la sección
3).

## 2.1. Perspectiva del Producto

Ensambla.me es un producto independiente: un sitio web frontend (HTML, CSS y
JavaScript puro, apoyado en el framework Bootstrap para estilos y componentes)
que no depende de ni se integra con otros sistemas externos en esta entrega. No
existe backend ni base de datos; toda la información de productos, usuarios,
órdenes y carrito se maneja del lado del cliente (arreglos JavaScript y
`localStorage`).

Además del catálogo tradicional, Ensambla.me se diferencia por incorporar un
asistente de armado por componentes que guía al cliente, categoría por
categoría, en la construcción de una PC gamer completa o por módulos.

La estructura del `index.html` referencia archivos separados por sección
(encabezado, navegación, aside, cuerpo, pie de página). El script
`src/scripts/includes.js` resuelve los atributos `[data-include]` al producirse
el evento `DOMContentLoaded` y solicita cada archivo mediante `fetch()`, por lo
que el proyecto debe servirse a través de un servidor HTTP y no funciona abierto
directamente desde el sistema de archivos (ver 3.1.4).

## 2.2. Funciones del Producto

Las funciones del sistema se agrupan en dos grandes áreas:

**Tienda (pública):**
- Navegación entre páginas mediante menú superior con logo y acceso al carrito.
- Visualización de catálogo de productos (imagen, nombre, precio) y su detalle.
- Asistente de armado de PC gamer (*Ensambla.me*): selección guiada de
  componentes por categoría (CPU, placa madre, RAM, almacenamiento, fuente de
  poder, gabinete, refrigeración, tarjeta gráfica, periféricos), donde elegir un
  componente filtra las opciones admisibles de la siguiente categoría según la
  tabla de compatibilidad; permite armar el equipo completo o trabajar solo por
  módulos (ej. solo actualizar almacenamiento) y agregar el armado resultante al
  carrito.
- Carrito de compras: agregar productos, eliminar ítems, modificar cantidades,
  ver el total y persistencia en `localStorage`.
- Registro de nuevos usuarios, inicio de sesión y cierre de sesión.
- Página "Nosotros" con información de la empresa y desarrolladores.
- Sección de blogs con listado y detalle de artículos.
- Formulario de contacto para envío de mensajes internos.

**Administración (protegida):**
- Autenticación y control de acceso según rol de usuario.
- Home administrativo con menú vertical.
- Mantenedor de Productos: listar, crear y editar.
- Mantenedor de Usuarios: listar, crear y editar.
- Vista de solo lectura de productos y órdenes para el rol Administrador
  logístico.

## 2.3. Características de los Usuarios

El sistema contempla tres tipos de perfiles de usuario:

- **Administrador**: acceso total al sistema, incluyendo los mantenedores de
  Producto y Usuario. Se espera un nivel de manejo de PC a nivel de usuario, sin
  necesidad de conocimientos técnicos avanzados.
- **Administrador logístico** (denominado *Vendedor* en el Anexo 1; en este
  proyecto se renombra para reflejar con mayor precisión su función): solo puede
  visualizar el listado y detalle de productos, y el listado y detalle de
  órdenes. No tiene acceso a ninguna otra funcionalidad administrativa. Se
  espera un nivel de manejo de PC básico.
- **Cliente**: usuario de la tienda pública; puede registrarse, iniciar sesión,
  navegar el catálogo, comprar (agregar al carrito) y contactar a la empresa. No
  se requiere ningún conocimiento técnico particular, solo el uso habitual de un
  navegador web.

## 2.4. Restricciones

- El sistema debe construirse únicamente con HTML, CSS y JavaScript puro, más el
  framework Bootstrap para estilos/componentes (sin frameworks adicionales de
  JavaScript en esta entrega).
- No debe utilizarse backend ni base de datos real en esta entrega; los datos se
  simulan en arreglos JavaScript y `localStorage`.
- El diseño debe ser responsivo y consistente en todas las páginas mediante una
  hoja de estilos CSS externa y propia.
- El proyecto debe versionarse con Git y publicarse en un repositorio público de
  GitHub, con commits claros y descriptivos.
- Las vistas administrativas deben estar protegidas mediante un mecanismo de
  autenticación (aunque sea simulado del lado del cliente en esta entrega).
- El sitio debe ejecutarse detrás de un servidor HTTP, dado que la composición
  de las páginas mediante `fetch()` no opera bajo el esquema `file://`.

## 2.5. Suposiciones y Dependencias

- Se asume que el usuario accede desde un navegador web moderno con soporte de
  `localStorage`, Fetch API y JavaScript habilitado.
- Se asume que los datos de productos, usuarios y órdenes de prueba (arreglos
  JS) son representativos para efectos de la demostración, y que no se requiere
  persistencia real entre distintos dispositivos o usuarios.
- Si en evaluaciones futuras se incorpora un backend y base de datos real,
  varios requisitos actuales (especialmente los relacionados con persistencia de
  carrito, productos y usuarios) deberán revisarse y actualizarse.

## 2.6. Requisitos Futuros

- Incorporación de un backend real con base de datos para persistir productos,
  usuarios y órdenes.
- Integración de una pasarela de pago para completar el flujo de compra.
- Gestión completa de órdenes (estado del pedido, historial de compras del
  cliente).
- Operación Eliminar en los mantenedores de Producto y Usuario, completando el
  CRUD definido en 1.3.
- Panel de reportes y estadísticas para el rol Administrador.
- Recuperación de contraseña y verificación de correo electrónico en el
  registro.
- Motor de validación automática de la compatibilidad técnica real entre
  componentes del armado (socket de CPU, tipo de memoria RAM, formato de
  gabinete, potencia de la fuente de poder), en reemplazo de la tabla de
  compatibilidad estática de esta entrega.

# 3. Requisitos Específicos

Esta sección detalla los requisitos de Ensambla.me con el nivel de detalle
suficiente para diseñar e implementar el sistema, y para que puedan verificarse
una vez construido.

## 3.1 Requisitos comunes de las interfaces

### 3.1.1 Interfaces de usuario

Las interfaces de usuario serán páginas web con una distribución de menú
superior (navegación, logo y carrito) y un área de contenido central para
mostrar la funcionalidad de cada vista. El panel de administración utiliza
además un menú lateral vertical. El asistente de armado se presenta como un
flujo guiado paso a paso (una categoría de componente a la vez) dentro del área
de contenido. El diseño es responsivo y consistente en todas las páginas
gracias a una hoja de estilos CSS externa y a los componentes de Bootstrap.

### 3.1.2 Interfaces de hardware

El sistema debe poder visualizarse y utilizarse correctamente desde un
dispositivo táctil móvil (smartphone o tablet), además de computadores de
escritorio, gracias al diseño responsivo.

### 3.1.3 Interfaces de software

- **Bootstrap (CSS y JS)**: framework utilizado para estilos, componentes de
  interfaz (menús, formularios, botones) y comportamiento responsivo.
- **Fetch API**: utilizada por `src/scripts/includes.js` para solicitar,
  mediante peticiones HTTP GET del mismo origen, los archivos HTML de cada
  sección (encabezado, navegación, aside, cuerpo, pie de página) y componer así
  cada página del sitio.
- **Web Storage API (`localStorage`)**: utilizada para persistir el contenido
  del carrito de compras en el navegador del cliente.

### 3.1.4 Interfaces de comunicación

El sistema no consume APIs externas ni servicios de terceros: toda la lógica de
negocio se ejecuta en el navegador del cliente. Sin embargo, no se trata de un
sitio que pueda abrirse como archivo local: realiza peticiones **HTTP GET del
mismo origen** para cargar sus propios fragmentos HTML mediante `fetch()`, por
lo que debe publicarse o ejecutarse detrás de un servidor HTTP. Para desarrollo
local basta, por ejemplo, con:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000/src/pages/index.html`. Abierto con el esquema
`file://`, el navegador bloquea esas peticiones y las secciones de la página no
se cargan.

## 3.2 Requisitos funcionales

Cada requisito funcional se especifica mediante una ficha que contiene: el
código y nombre del requisito, los actores involucrados, la historia de usuario
que lo motiva, la descripción del comportamiento esperado y sus criterios de
aceptación. Los criterios de aceptación son las condiciones verificables que
deben cumplirse para considerar el requisito satisfecho, y son la base con la
que se completa la columna "Criterio de Aceptación" de la Planilla de
Requerimientos (Anexos 2 y 3). Los códigos RF-xx son identificadores estables:
no se reutilizan ni se renumeran al agregar nuevos requisitos.

Los requisitos no funcionales (sección 3.3) no se expresan como historias de
usuario, ya que no describen la acción de un actor, pero sí cuentan con su
propia lista de criterios de aceptación al final de cada subsección.

> **RF-01 — Registrar usuario**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente**, quiero registrarme en la tienda para
> guardar mis datos personales y de despacho, y no tener que escribirlos en cada
> compra.
>
> Descripción: El cliente debe poder registrarse en el sistema completando un
> formulario con RUN (requerido, sin puntos ni guion, mín. 7, máx. 9, validando
> el dígito verificador), nombre (requerido, máx. 50), apellidos (requerido,
> máx. 100), correo (requerido, máx. 100, restringido a los dominios permitidos
> definidos en 1.3), contraseña (requerida, entre 4 y 10 caracteres, enmascarada
> en pantalla, misma regla que el inicio de sesión de RF-02), fecha de
> nacimiento (opcional), región y comuna (seleccionadas desde arreglos JS, la
> comuna se actualiza al cambiar la región) y dirección (requerida, máx. 300).
> Estas son las mismas reglas usadas por el mantenedor "Crear usuario" del
> administrador (RF-11).
>
> Criterios de aceptación:
>
> 1. Dado el formulario de registro, cuando se envía con algún campo requerido
>    vacío (RUN, nombre, apellidos, correo, contraseña o dirección), entonces el
>    sistema impide el envío y muestra un mensaje de error junto a cada campo
>    faltante.
> 2. Dado un RUN con puntos, con guion o con dígito verificador incorrecto (ej.
>    `19.011.022-3`), cuando el campo se valida, entonces se muestra el error
>    "RUN inválido" y el formulario no se envía.
> 3. Dado un RUN válido sin puntos ni guion de entre 7 y 9 caracteres (ej.
>    `19011022K`), cuando el campo se valida, entonces se marca como correcto.
> 4. Dado un correo cuyo dominio no está en los dominios permitidos (ej.
>    `juan@hotmail.com`), cuando el campo se valida, entonces se muestra un
>    error que indica los dominios aceptados y el formulario no se envía.
> 5. Dada una contraseña de menos de 4 o más de 10 caracteres, cuando el campo
>    se valida, entonces se muestra el error correspondiente; el campo se
>    muestra enmascarado en todo momento.
> 6. Dado el select de región, cuando se cambia la región seleccionada, entonces
>    el select de comuna se recarga únicamente con las comunas de esa región.
> 7. Dados valores que superan los máximos definidos (nombre > 50, apellidos >
>    100, correo > 100 o dirección > 300 caracteres), cuando se intenta
>    ingresarlos, entonces el campo impide superar el límite o muestra el error
>    correspondiente.
> 8. Dada la fecha de nacimiento sin completar, cuando se envía el formulario,
>    entonces el registro se acepta, ya que el campo es opcional.
> 9. Dado un formulario completo y válido, cuando se envía, entonces el usuario
>    se agrega al arreglo de usuarios y se muestra un mensaje de confirmación.
> 10. El select de tipo de usuario no se muestra en esta vista pública (solo
>     existe en RF-11).

> **RF-02 — Iniciar sesión**
>
> Actores: Cliente, Administrador logístico, Administrador
>
> Historia de usuario: Como **usuario registrado**, quiero iniciar sesión con mi
> correo y contraseña para acceder a las funcionalidades que corresponden a mi
> rol.
>
> Descripción: El usuario debe poder iniciar sesión con correo (requerido, máx.
> 100, restringido a los dominios permitidos definidos en 1.3) y contraseña
> (requerida, entre 4 y 10 caracteres). Según el tipo de usuario autenticado, el
> sistema debe redirigir y habilitar las funcionalidades correspondientes a su
> rol.
>
> Criterios de aceptación:
>
> 1. Dado un correo y una contraseña que coinciden con un usuario del arreglo,
>    cuando se envía el formulario, entonces la sesión se inicia y se redirige
>    según el rol.
> 2. Dado un usuario con rol Cliente, cuando inicia sesión, entonces se redirige
>    a la tienda pública; con rol Administrador, al home administrativo (RF-16);
>    con rol Administrador logístico, a la vista de productos y órdenes en solo
>    lectura (RF-12).
> 3. Dado un correo con un dominio no permitido, cuando se valida, entonces se
>    muestra el error y no se envía el formulario.
> 4. Dada una contraseña con menos de 4 o más de 10 caracteres, cuando se
>    valida, entonces se muestra el error y no se envía el formulario.
> 5. Dadas credenciales que no coinciden con ningún usuario, cuando se envía,
>    entonces se muestra un mensaje genérico ("correo o contraseña incorrectos")
>    sin revelar cuál de los dos falló.
> 6. El campo contraseña se muestra siempre enmascarado (ver 3.3.2).

> **RF-03 — Visualizar catálogo de productos**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente**, quiero ver el listado de productos
> disponibles con su imagen, nombre y precio para identificar rápidamente lo que
> me interesa.
>
> Descripción: El cliente debe poder ver, en la página de inicio y en la página
> de productos, un listado de productos con imagen, nombre y precio, generado
> dinámicamente desde un arreglo de JavaScript.
>
> Criterios de aceptación:
>
> 1. Dado el arreglo de productos, cuando se carga la página de inicio o la de
>    productos, entonces se renderiza una tarjeta por producto con su imagen,
>    nombre y precio.
> 2. Dado que se agrega un elemento al arreglo de productos, cuando se recarga
>    la página, entonces la nueva tarjeta aparece sin haber modificado el HTML,
>    lo que demuestra que el listado se genera dinámicamente.
> 3. Los precios se muestran formateados como moneda (pesos chilenos).
> 4. Dado un arreglo de productos vacío, cuando se carga la vista, entonces se
>    muestra un mensaje de "no hay productos disponibles" en lugar de un área en
>    blanco.

> **RF-04 — Ver detalle de producto**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente**, quiero revisar el detalle de un
> producto para conocer sus características antes de decidir la compra.
>
> Descripción: Al hacer clic sobre un producto del listado, el cliente debe ser
> redirigido a una vista de detalle del producto, donde puede añadirlo al
> carrito de compras.
>
> Criterios de aceptación:
>
> 1. Dado el listado de productos, cuando se hace clic sobre un producto,
>    entonces se navega a la vista de detalle de ese producto y no de otro.
> 2. Dada la vista de detalle, entonces muestra imagen, nombre, precio,
>    descripción y categoría del producto seleccionado.
> 3. Dada la vista de detalle, entonces incluye un botón "Añadir al carrito"
>    operativo (RF-05).
> 4. Dado un código de producto que no existe en el arreglo, cuando se intenta
>    abrir su detalle, entonces se muestra un mensaje de producto no encontrado
>    en lugar de una vista vacía o un error de JavaScript.

> **RF-05 — Agregar producto al carrito**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente**, quiero añadir un producto al carrito
> desde el listado o desde su detalle para no perder el hilo de mi navegación.
>
> Descripción: El cliente debe poder agregar un producto al carrito de compras
> desde la vista de listado de productos o desde el detalle de producto.
>
> Criterios de aceptación:
>
> 1. Dado el listado de productos, cuando se pulsa el botón de añadir de un
>    producto, entonces el producto se agrega al carrito y el contador del menú
>    superior aumenta en uno.
> 2. Dada la vista de detalle de producto, cuando se pulsa "Añadir al carrito",
>    entonces se obtiene el mismo resultado que desde el listado.
> 3. Dado un producto que ya está en el carrito, cuando se vuelve a añadir,
>    entonces se incrementa su cantidad en lugar de crear una segunda línea para
>    el mismo producto.
> 4. Cuando se añade un producto, entonces se muestra una confirmación visual al
>    cliente.
> 5. Cuando se añade un producto, entonces el contenido del carrito se guarda de
>    inmediato en `localStorage`.

> **RF-06 — Gestionar carrito de compras**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente**, quiero revisar y ajustar el contenido
> de mi carrito para controlar qué voy a comprar y cuánto voy a gastar.
>
> Descripción: El cliente debe poder visualizar el contenido del carrito de
> compras, eliminar un producto del carrito, modificar la cantidad de un ítem y
> ver el total calculado a partir de los precios y las cantidades. El carrito se
> implementa como un arreglo de productos en JavaScript, se renderiza desde
> dicho arreglo, y su contenido se persiste en `localStorage` para mantenerse
> entre sesiones.
>
> Criterios de aceptación:
>
> 1. Dada la vista del carrito con productos, entonces cada línea muestra
>    imagen, nombre, precio unitario, cantidad y subtotal.
> 2. Dado un ítem del carrito, cuando se elimina, entonces desaparece del
>    listado y el total se recalcula sin recargar la página.
> 3. Dado un ítem del carrito, cuando se modifica su cantidad, entonces su
>    subtotal y el total se recalculan; no se permite una cantidad menor que 1.
> 4. El total mostrado corresponde exactamente a la suma de precio unitario por
>    cantidad de todas las líneas del carrito.
> 5. Dado un carrito con productos, cuando se recarga la página o se cierra y
>    reabre el navegador, entonces el carrito conserva su contenido
>    (persistencia en `localStorage`).
> 6. Dado un carrito vacío, entonces se muestra un mensaje indicándolo y el
>    total es 0.

> **RF-07 — Armar PC gamer por componentes**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente sin conocimientos técnicos**, quiero que
> el sitio me guíe categoría por categoría al elegir los componentes de mi PC
> gamer para no equivocarme al combinarlos.
>
> Descripción: El cliente debe poder utilizar el asistente de armado
> (*Ensambla.me*) para construir una PC gamer seleccionando, categoría por
> categoría (CPU, placa madre, RAM, almacenamiento, fuente de poder, gabinete,
> refrigeración, tarjeta gráfica, periféricos), los componentes deseados. Al
> seleccionar un componente, el sistema debe filtrar las opciones de la
> siguiente categoría según la tabla de compatibilidad estática definida en los
> arreglos JavaScript (ver 1.3); no se realiza ningún cálculo de compatibilidad
> técnica real, lo que queda como requisito futuro (ver 2.6). El cliente puede
> optar por completar el armado de todas las categorías (equipo completo) o
> seleccionar solo algunos módulos de forma independiente (ej. solo
> almacenamiento). Al finalizar, el cliente puede agregar el conjunto de
> componentes armado al carrito de compras.
>
> Criterios de aceptación:
>
> 1. Dado el asistente de armado, entonces presenta las categorías en un orden
>    definido y una categoría a la vez.
> 2. Dado un componente seleccionado, cuando se avanza a la siguiente categoría,
>    entonces solo se listan las opciones asociadas a ese componente en la tabla
>    de compatibilidad.
> 3. Dado un CPU de un socket determinado, cuando se avanza a la categoría de
>    placa madre, entonces no se ofrecen placas madre asociadas a otro socket en
>    la tabla.
> 4. Dado un armado parcial (modo módulos), cuando el cliente decide finalizar
>    sin recorrer todas las categorías, entonces el sistema lo permite y agrega
>    al carrito únicamente los componentes seleccionados.
> 5. Dado un armado que recorre todas las categorías (equipo completo), cuando
>    se finaliza, entonces se agrega al carrito el conjunto completo.
> 6. Dado un armado agregado al carrito, entonces se identifica como un
>    conjunto, muestra el detalle de sus componentes y su precio corresponde a
>    la suma de ellos.
> 7. El sistema no emite ningún juicio de compatibilidad técnica real: si la
>    tabla asocia dos componentes, la combinación se acepta (ver 1.2 y 2.6).

> **RF-08 — Enviar mensaje de contacto**
>
> Actores: Cliente
>
> Historia de usuario: Como **visitante**, quiero enviar un mensaje a la empresa
> para resolver dudas antes de comprar.
>
> Descripción: El cliente debe poder enviar un mensaje interno a la empresa
> mediante un formulario de contacto con nombre (requerido, máx. 100), correo
> (requerido, máx. 100, restringido a los dominios permitidos definidos en 1.3)
> y comentario (requerido, máx. 500).
>
> Nota: el Anexo 1 no marca el correo como obligatorio en este formulario; se
> exige como requerido por decisión del proyecto, dado que sin él la empresa no
> puede responder el mensaje.
>
> Criterios de aceptación:
>
> 1. Dado el formulario de contacto, cuando se envía con nombre, correo o
>    comentario vacíos, entonces se impide el envío y se muestra el error en
>    cada campo faltante.
> 2. Dado un correo con un dominio no permitido, cuando se valida, entonces se
>    muestra el error indicando los dominios aceptados.
> 3. Dados un nombre de más de 100 caracteres o un comentario de más de 500,
>    cuando se intenta ingresarlos, entonces el campo impide superar el límite o
>    muestra el error.
> 4. Las validaciones se ejecutan en tiempo real, antes de pulsar el botón de
>    envío (ver 3.3.2).
> 5. Dado un formulario válido, cuando se envía, entonces se muestra un mensaje
>    de éxito y los campos quedan limpios.

> **RF-09 — Consultar blogs**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente**, quiero leer los artículos del blog de
> la tienda para informarme sobre tecnología y novedades.
>
> Descripción: El cliente debe poder visualizar un listado de artículos de blog
> (imagen, título, descripción corta) y acceder al detalle de al menos dos
> artículos (imagen, título, descripción larga).
>
> Criterios de aceptación:
>
> 1. Dada la vista de blogs, entonces muestra un listado de artículos y cada uno
>    presenta imagen, título y descripción corta.
> 2. Dado un artículo del listado, cuando se hace clic en él, entonces se abre
>    su detalle con imagen, título y descripción larga.
> 3. Existen al menos dos artículos con detalle navegable.

> **RF-10 — Mantenedor de Productos**
>
> Actores: Administrador
>
> Historia de usuario: Como **administrador**, quiero mantener el catálogo de
> productos para que la información que ve el cliente esté correcta y
> actualizada.
>
> Descripción: El administrador debe poder listar todos los productos, crear un
> nuevo producto y editar uno existente, ingresando: código de producto (SKU)
> (requerido, texto, mín. 3 caracteres, sin límite superior), nombre (requerido,
> máx. 100), descripción (opcional, máx. 500), precio (requerido, mín. 0 —un
> valor 0 se considera un producto gratuito—, sin límite superior, admite
> decimales), stock (requerido, mín. 0, sin límite superior, solo enteros),
> stock crítico (opcional, mín. 0, solo enteros, muestra alerta cuando el stock
> sea igual o inferior a este valor), categoría (requerida, mediante select) e
> imagen (opcional).
>
> Criterios de aceptación:
>
> 1. Dada la vista de listado, entonces muestra todos los productos del arreglo
>    con las acciones de crear y editar disponibles.
> 2. Dado un código de producto de menos de 3 caracteres, cuando se valida,
>    entonces se muestra el error y no se guarda.
> 3. Dado un precio negativo, cuando se valida, entonces se muestra el error; un
>    precio 0 se acepta y se interpreta como producto gratuito; se aceptan
>    valores decimales.
> 4. Dado un stock negativo o con decimales, cuando se valida, entonces se
>    muestra el error, ya que solo se admiten enteros mayores o iguales a 0.
> 5. Dado un stock crítico sin completar, cuando se guarda, entonces el producto
>    se acepta por ser un campo opcional.
> 6. Dado un producto cuyo stock es igual o inferior a su stock crítico, cuando
>    se lista, entonces se muestra una alerta visible de bajo inventario.
> 7. Dada una categoría sin seleccionar, cuando se envía el formulario, entonces
>    se muestra el error, ya que el campo es requerido.
> 8. Dado un formulario válido, cuando se crea un producto, entonces aparece en
>    el listado; cuando se edita uno existente, entonces los cambios se reflejan
>    en el listado.
> 9. La vista no ofrece la acción Eliminar, que queda fuera del alcance de esta
>    entrega (ver 1.3 y 2.6).

> **RF-11 — Mantenedor de Usuarios**
>
> Actores: Administrador
>
> Historia de usuario: Como **administrador**, quiero mantener los usuarios del
> sistema y asignarles su rol para controlar quién accede a cada funcionalidad.
>
> Descripción: El administrador debe poder listar todos los usuarios, crear un
> nuevo usuario y editar uno existente, con las mismas reglas de campos que
> RF-01 (incluidos RUN y contraseña), más un campo adicional de tipo de usuario
> (select: Administrador, Cliente o Administrador logístico), visible solo en
> esta vista administrativa.
>
> Criterios de aceptación:
>
> 1. Dada la vista de listado, entonces muestra todos los usuarios del arreglo
>    con las acciones de crear y editar disponibles.
> 2. Dado el formulario de crear o editar usuario, entonces aplica las mismas
>    validaciones de RF-01, incluidas las de RUN y contraseña.
> 3. Dado el select de tipo de usuario, entonces ofrece exactamente las opciones
>    Administrador, Cliente y Administrador logístico.
> 4. Dado un usuario creado con un rol determinado, cuando ese usuario inicia
>    sesión, entonces accede únicamente a lo que su rol permite (RF-02, RF-12).
> 5. Dado un formulario válido, cuando se crea un usuario, entonces aparece en
>    el listado; cuando se edita uno existente, entonces los cambios se reflejan
>    en el listado.
> 6. La vista no ofrece la acción Eliminar, que queda fuera del alcance de esta
>    entrega (ver 1.3 y 2.6).

> **RF-12 — Visualizar productos y órdenes (rol Administrador logístico)**
>
> Actores: Administrador logístico
>
> Historia de usuario: Como **administrador logístico**, quiero consultar
> productos y órdenes en modo lectura para preparar los despachos sin riesgo de
> alterar datos.
>
> Descripción: El administrador logístico debe poder visualizar el listado y
> detalle de productos, y el listado y detalle de órdenes, en modo de solo
> lectura. Ninguna otra funcionalidad administrativa debe estar visible ni
> accesible para este rol.
>
> Criterios de aceptación:
>
> 1. Dado un usuario autenticado con rol Administrador logístico, entonces el
>    menú administrativo muestra únicamente las opciones de Productos y Órdenes.
> 2. Dado ese mismo rol, cuando se intenta abrir por URL directa un mantenedor
>    de creación o edición, entonces el acceso se deniega y no se renderiza la
>    vista.
> 3. Dado el listado de productos, entonces se muestra en modo lectura, sin
>    botones de crear, editar ni eliminar.
> 4. Dado el listado de órdenes, entonces cada orden muestra cliente, fecha,
>    productos y total, y su detalle también se presenta en modo lectura.

> **RF-13 — Cerrar sesión**
>
> Actores: Cliente, Administrador logístico, Administrador
>
> Historia de usuario: Como **usuario autenticado**, quiero cerrar mi sesión
> para que nadie más pueda usar mi cuenta en un equipo compartido.
>
> Descripción: El usuario autenticado debe poder cerrar su sesión desde
> cualquier vista. El sistema debe limpiar los datos de sesión almacenados en el
> cliente y redirigir a la tienda pública, de modo que las vistas
> administrativas vuelvan a quedar inaccesibles (ver 3.3.2).
>
> Criterios de aceptación:
>
> 1. Dado un usuario autenticado, entonces la opción de cerrar sesión está
>    visible en todas las vistas a las que tiene acceso.
> 2. Dado un usuario autenticado, cuando cierra sesión, entonces los datos de
>    sesión almacenados en el cliente se eliminan y se redirige a la tienda
>    pública.
> 3. Dado un usuario que acaba de cerrar sesión, cuando intenta abrir una vista
>    administrativa por URL directa, entonces se le redirige al inicio de sesión
>    (ver 3.3.2).
> 4. El contenido del carrito guardado en `localStorage` no se elimina al cerrar
>    sesión, ya que en esta entrega el carrito se asocia al navegador y no al
>    usuario.

> **RF-14 — Navegar el sitio**
>
> Actores: Cliente
>
> Historia de usuario: Como **cliente**, quiero un menú de navegación siempre
> visible con acceso al carrito para moverme por el sitio y saber cuántos ítems
> llevo.
>
> Descripción: Todas las vistas públicas deben presentar un menú superior de
> navegación con el logo de la tienda, enlaces a Inicio, Productos, Blogs,
> Nosotros y Contacto, y un acceso al carrito de compras que muestre la cantidad
> de ítems que contiene.
>
> Criterios de aceptación:
>
> 1. Dada cualquier vista pública, entonces muestra el menú superior con el logo
>    y los enlaces a Inicio, Productos, Blogs, Nosotros y Contacto.
> 2. Dado el menú superior, cuando se pulsa un enlace, entonces se navega a la
>    vista correspondiente.
> 3. Dado el acceso al carrito del menú, entonces muestra la cantidad de ítems
>    que contiene y se actualiza al agregar o eliminar productos.
> 4. Dado el logo de la tienda, cuando se pulsa, entonces se navega a la página
>    de inicio.
> 5. Dado un viewport de ancho menor a 768 px, entonces el menú colapsa en un
>    botón desplegable y todos sus enlaces siguen siendo accesibles (ver 3.1.2).

> **RF-15 — Consultar información de la empresa**
>
> Actores: Cliente
>
> Historia de usuario: Como **visitante**, quiero conocer quién está detrás de
> la tienda para decidir si le compro con confianza.
>
> Descripción: El cliente debe poder acceder a la vista "Nosotros", donde se
> describe de qué se trata la empresa y quiénes son sus desarrolladores.
>
> Criterios de aceptación:
>
> 1. Dada la vista "Nosotros", entonces es accesible desde el menú superior de
>    cualquier vista pública.
> 2. Dada la vista "Nosotros", entonces contiene una descripción de la empresa y
>    la presentación de sus desarrolladores.
> 3. La vista reutiliza el mismo encabezado, navegación y pie de página que el
>    resto del sitio, y utiliza etiquetado HTML semántico.

> **RF-16 — Acceder al home administrativo**
>
> Actores: Administrador
>
> Historia de usuario: Como **administrador**, quiero un panel de inicio con un
> menú visible para llegar de forma directa a los mantenedores del sistema.
>
> Descripción: Tras autenticarse, el administrador debe acceder a una vista de
> inicio del panel administrativo con un menú vertical visible que permita
> navegar a los mantenedores de Productos y Usuarios. Esta vista no debe ser
> accesible sin autenticación previa (ver 3.3.2).
>
> Criterios de aceptación:
>
> 1. Dado un usuario con rol Administrador, cuando inicia sesión correctamente,
>    entonces se le dirige al home administrativo.
> 2. Dado el home administrativo, entonces presenta un menú vertical visible con
>    enlaces a los mantenedores de Productos y Usuarios.
> 3. Dado el menú vertical, cuando se pulsa una de sus opciones, entonces se
>    abre el mantenedor correspondiente (RF-10 o RF-11).
> 4. Dado un visitante sin sesión iniciada, cuando intenta abrir el home
>    administrativo por URL directa, entonces se le redirige al inicio de sesión
>    (ver 3.3.2).

## 3.3 Requisitos no funcionales

### 3.3.1 Requisitos de rendimiento

Al tratarse de un sitio estático sin backend, cada vista debe cargar
completamente en menos de 2 segundos en una conexión de banda ancha estándar,
dado que no existen llamadas a servicios externos ni consultas a base de datos
en esta entrega.

Criterios de aceptación:

1. Dado el sitio servido por HTTP en una conexión de banda ancha estándar,
   cuando se abre cualquier vista, entonces termina de cargar en menos de 2
   segundos, medido en la pestaña de red del navegador con la caché
   deshabilitada.
2. Dada la carga de cualquier vista, entonces las únicas peticiones registradas
   corresponden a recursos del mismo origen (HTML de secciones, CSS, JS e
   imágenes); no se observan llamadas a servicios externos.
3. Dada la composición de secciones mediante `fetch()`, entonces se completa
   antes de que el usuario pueda interactuar, sin dejar contenedores vacíos de
   forma permanente.

### 3.3.2 Seguridad

- Todas las contraseñas ingresadas en los formularios deben enmascararse (tipo
  `password`) en pantalla, tanto en el inicio de sesión como en el registro y en
  el mantenedor de Usuarios.
- Las vistas del panel administrativo deben quedar inaccesibles para un usuario
  que no haya iniciado sesión y también para un usuario autenticado con rol
  Cliente, cuyo acceso se limita a la tienda pública.
- Las funcionalidades visibles para el rol Administrador logístico deben
  restringirse a únicamente productos y órdenes en modo lectura; el resto de
  opciones administrativas no debe renderizarse para este rol.
- El cierre de sesión (RF-13) debe limpiar los datos de sesión del cliente, de
  modo que las vistas administrativas dejen de ser accesibles.
- Todos los formularios (registro, login, contacto, producto, usuario) deben
  validarse en tiempo real en el cliente, mostrando mensajes de error y
  sugerencias personalizados antes de permitir el envío.

Criterios de aceptación:

1. Dado un usuario sin sesión iniciada, cuando intenta abrir una vista
   administrativa por URL directa, entonces se le redirige al inicio de sesión.
2. Dado un usuario autenticado con rol Cliente, cuando intenta abrir una vista
   administrativa por URL directa, entonces el acceso se deniega.
3. Dado un usuario autenticado con rol Administrador logístico, cuando se
   renderiza el menú administrativo, entonces solo contiene Productos y Órdenes,
   y las demás opciones no están presentes en el DOM (no basta con ocultarlas
   por CSS).
4. Dado cualquier campo de contraseña del sistema (inicio de sesión, registro y
   mantenedor de Usuarios), entonces tiene el atributo `type="password"`,
   verificable inspeccionando el DOM.
5. Dado cualquier formulario del sistema, cuando se ingresa un valor inválido,
   entonces el mensaje de error se muestra antes de pulsar el botón de envío.
6. Dado un usuario que ha cerrado sesión (RF-13), cuando intenta volver a una
   vista administrativa, entonces se le redirige nuevamente al inicio de sesión.

### 3.3.3 Fiabilidad

Al no depender de un backend, el sistema no debe presentar errores de carga de
página bajo uso normal del navegador; los únicos incidentes esperables
corresponden a errores de validación de formularios, que deben ser gestionados y
comunicados claramente al usuario sin interrumpir la navegación.

Criterios de aceptación:

1. Dada la navegación por todas las vistas del sitio, entonces la consola del
   navegador no registra errores de JavaScript.
2. Dado un archivo de sección que no se puede cargar, entonces el error se
   registra en la consola y el resto de la página permanece utilizable, según el
   manejo de errores implementado en `src/scripts/includes.js`.
3. Dado un error de validación en cualquier formulario, entonces se comunica
   junto al campo afectado y la navegación del sitio sigue disponible.
4. Dado un contenido inválido o corrupto en `localStorage`, cuando se carga el
   carrito, entonces el sistema lo inicializa vacío en lugar de interrumpir la
   ejecución.

### 3.3.4 Disponibilidad

Al ser un sitio 100% estático (sin servidor de aplicación ni base de datos), la
disponibilidad depende únicamente del servicio de hosting/repositorio utilizado
para publicarlo, esperando una disponibilidad cercana al 100% del tiempo.

Criterios de aceptación:

1. Dado el sitio publicado en el servicio de hosting o repositorio elegido,
   entonces es accesible mediante su URL pública sin requerir credenciales.
2. Dado el sitio en ejecución, entonces no realiza llamadas a servicios propios,
   por lo que su disponibilidad corresponde a la del hosting utilizado.
3. Dado el proyecto recién clonado desde el repositorio, entonces puede
   ejecutarse localmente únicamente con un servidor HTTP, sin pasos de
   compilación ni instalación de dependencias.

### 3.3.5 Mantenibilidad

El sitio debe mantenerse mediante la separación de cada sección de la página
(encabezado, navegación, aside, cuerpo, pie de página) en archivos HTML
independientes referenciados desde `index.html`, y mediante una hoja de estilos
CSS externa única. El mantenimiento (agregar productos de prueba, ajustar
validaciones, etc.) puede ser realizado directamente por el desarrollador
editando estos archivos.

Criterios de aceptación:

1. Dada la estructura del proyecto, entonces cada sección de la página
   (encabezado, navegación, aside, cuerpo y pie) reside en su propio archivo
   dentro de `src/pages/` y se referencia desde `index.html` mediante el
   atributo `data-include`.
2. Dado el proyecto completo, entonces existe una única hoja de estilos propia y
   externa (`src/styles/style.css`), y ninguna vista define estilos mediante
   atributos `style` ni bloques `<style>`.
3. Dado que se agrega un elemento al arreglo de productos, cuando se recarga el
   catálogo, entonces el producto aparece sin haber modificado el HTML ni el
   CSS.
4. Dado que se modifica una sección compartida (por ejemplo el pie de página),
   entonces el cambio se refleja en todas las vistas habiendo editado un solo
   archivo.

### 3.3.6 Portabilidad

El sistema debe funcionar correctamente en cualquier navegador web moderno
(Chrome, Firefox, Edge) sin depender de un sistema operativo, compilador o
plataforma de desarrollo específica, dado que utiliza únicamente HTML, CSS,
JavaScript y Bootstrap. La única condición de ejecución es que el proyecto se
sirva mediante un servidor HTTP y no se abra directamente desde el sistema de
archivos (ver 3.1.4).

Criterios de aceptación:

1. Dado el sitio servido por HTTP, entonces se visualiza y opera correctamente
   en las versiones actuales de Chrome, Firefox y Edge.
2. Dado el proyecto, entonces no requiere compilación, instalación de
   dependencias ni configuración específica del sistema operativo para
   ejecutarse.
3. Dado el sitio abierto con el esquema `file://`, entonces las secciones no se
   cargan; la única forma de ejecución soportada es detrás de un servidor HTTP
   (ver 3.1.4).
4. Dado cualquier viewport de escritorio, tablet o móvil, entonces el diseño se
   adapta sin producir desplazamiento horizontal (ver 3.1.2).

## 3.4 Otros Requisitos

- El proyecto debe mantenerse en un repositorio Git/GitHub público, con
  historial de commits claros y coherentes que documenten el avance del
  desarrollo, ya que este historial será evaluado como parte de la ronda de
  preguntas de la Entrega I.
- El repositorio debe documentar cómo ejecutar el proyecto localmente
  (`python3 -m http.server 8000` y luego
  `http://localhost:8000/src/pages/index.html`), dado que la composición de
  páginas mediante `fetch()` convierte el uso de un servidor HTTP en un
  prerrequisito y no en una comodidad.

## 3.5 Trazabilidad de requisitos

La siguiente tabla relaciona cada requisito con su tipo, clasificación, actores
y la vista o alcance donde se implementa, replicando las columnas de la Planilla
de Requerimientos (Anexos 2 y 3). La columna "Crit." indica la cantidad de
criterios de aceptación definidos para el requisito; su descripción y sus
criterios completos están en la ficha correspondiente (sección 3.2) o en la
subsección indicada (secciones 3.3 y 3.4). Los códigos RNF-xx identifican los
requisitos no funcionales únicamente para efectos de esta tabla y de la
planilla.

| Código | Tipo         | Clasificación                   | Actores                                | Vista / alcance               | Crit. | Estado     |
|--------|--------------|---------------------------------|----------------------------------------|-------------------------------|-------|------------|
| RF-01  | Funcional    | Funcional de usuario            | Cliente                                | Registro de usuario           | 10    | Solicitado |
| RF-02  | Funcional    | Funcional de usuario            | Cliente, Adm. logístico, Administrador | Inicio de sesión              | 6     | Solicitado |
| RF-03  | Funcional    | Funcional de usuario            | Cliente                                | Inicio / Productos            | 4     | Solicitado |
| RF-04  | Funcional    | Funcional de usuario            | Cliente                                | Detalle de producto           | 4     | Solicitado |
| RF-05  | Funcional    | Funcional de usuario            | Cliente                                | Productos / Detalle           | 5     | Solicitado |
| RF-06  | Funcional    | Funcional de usuario            | Cliente                                | Carrito de compras            | 6     | Solicitado |
| RF-07  | Funcional    | Funcional de sistema            | Cliente                                | Asistente de armado           | 7     | Solicitado |
| RF-08  | Funcional    | Funcional de usuario            | Cliente                                | Contacto                      | 5     | Solicitado |
| RF-09  | Funcional    | Funcional de usuario            | Cliente                                | Blogs / Detalle de blog       | 3     | Solicitado |
| RF-10  | Funcional    | Funcional de usuario            | Administrador                          | Admin: Productos              | 9     | Solicitado |
| RF-11  | Funcional    | Funcional de usuario            | Administrador                          | Admin: Usuarios               | 6     | Solicitado |
| RF-12  | Funcional    | Funcional de sistema            | Adm. logístico                         | Admin: Productos y Órdenes    | 4     | Solicitado |
| RF-13  | Funcional    | Funcional de usuario            | Cliente, Adm. logístico, Administrador | Transversal                   | 4     | Solicitado |
| RF-14  | Funcional    | Funcional de usuario            | Cliente                                | Transversal (vistas públicas) | 5     | Solicitado |
| RF-15  | Funcional    | Funcional de usuario            | Cliente                                | Nosotros                      | 3     | Solicitado |
| RF-16  | Funcional    | Funcional de usuario            | Administrador                          | Admin: Home                   | 4     | Solicitado |
| RNF-01 | No funcional | No funcional de producto        | Todos                                  | 3.3.1 Rendimiento             | 3     | Solicitado |
| RNF-02 | No funcional | No funcional de producto        | Todos                                  | 3.3.2 Seguridad               | 6     | Solicitado |
| RNF-03 | No funcional | No funcional de producto        | Todos                                  | 3.3.3 Fiabilidad              | 4     | Solicitado |
| RNF-04 | No funcional | No funcional Externos           | Todos                                  | 3.3.4 Disponibilidad          | 3     | Solicitado |
| RNF-05 | No funcional | No funcional de producto        | Desarrollador                          | 3.3.5 Mantenibilidad          | 4     | Solicitado |
| RNF-06 | No funcional | No funcional de producto        | Todos                                  | 3.3.6 Portabilidad            | 4     | Solicitado |
| RNF-07 | No funcional | No funcional de la Organización | Desarrollador                          | 3.4 Otros Requisitos          | —     | Solicitado |

El estado de todos los requisitos es "Solicitado": esta revisión del ERS define
la propuesta y aún no existe implementación asociada. El estado se actualizará
en las revisiones siguientes conforme avance el desarrollo.
