----------------------------------------------------------------------- DUOC UC
- Escuela de Informática y Telecomunicaciones
-----------------------------------------------------------------------
Especificación de Requisitos de Software

*Proyecto:* Ensambla.me – Tienda Online de Tecnología

**Revisión: 1.0**

**Autor:** Daniel Muñoz

**24-09-2026**
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

# Ficha del documento

| **Fecha**  | **Revisión** | **Autor**     | **Modificación**                 |
|------------|--------------|---------------|-----------------------------------|
| 24-09-2026 | 1.0          | Daniel Muñoz  | Versión inicial del ERS (Entrega
I) |

Documento validado por las partes en fecha: *pendiente de presentación (Entrega
I)*.

| Por el cliente | Por la empresa suministradora | |---|---| | [Firma] | [Firma]
| | Sr./Sra. — Docente evaluador | Sr./Sra. Daniel Muñoz |

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

El sistema se denomina **Ensambla.me**. Una pagina web que te guia sobre la
construccion de tu PC gamer, escogiendo paso por paso los componentes, hasta
construir la maquina de forma completa o modulos.

En esta primera entrega, el sistema:

- **Sí hará:** permitir la navegación pública por catálogo de productos, blogs,
  información de la empresa y contacto; permitir el registro e inicio de sesión
  de usuarios; permitir armar una PC gamer seleccionando componentes de forma
  guiada por categoría, ya sea el equipo completo o solo módulos específicos
  (ej. únicamente almacenamiento o únicamente refrigeración); permitir agregar
  productos y armados al carrito de compras y gestionarlo; y ofrecer un panel
  administrativo protegido con mantenedores (listar/crear/editar) de Productos y
  Usuarios.
- **No hará (en esta entrega):** procesar pagos reales, conectarse a una base de
  datos o backend real, ni gestionar el ciclo completo de una orden de compra
  (despacho, facturación, etc.). Tampoco validará automáticamente la
  compatibilidad técnica real entre componentes (ej. socket de CPU, tipo de
  RAM, formato de gabinete); en esta entrega la selección guiada se basa en
  categorías predefinidas y no en un motor de compatibilidad. Los datos de
  productos y usuarios se simulan mediante arreglos de JavaScript, y el carrito
  se persiste únicamente en `localStorage` del navegador.

Los beneficios esperados son: contar con una base funcional y bien estructurada
(HTML semántico, CSS propio y responsivo, validaciones JS) que sirva de
fundamento para incorporar en evaluaciones posteriores un backend real, base de
datos y pasarela de pago.

## 1.3. Definiciones, Acrónimos y Abreviaturas

- **ERS**: Especificación de Requisitos de Software.
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
- **Carrito de compras**: estructura de datos en JavaScript que almacena los
  productos seleccionados por el cliente antes de finalizar una compra.
- **LocalStorage**: mecanismo de almacenamiento del navegador (Web Storage API)
  usado para persistir el contenido del carrito entre sesiones.
- **Stock crítico**: cantidad mínima de unidades de un producto a partir de la
  cual el sistema debe mostrar una alerta de bajo inventario.
- **CRUD**: Crear, Leer (listar), Actualizar y Eliminar — operaciones básicas de
  un mantenedor.
- **Mantenedor**: vista administrativa que permite listar, crear y editar
  registros de una entidad (Producto o Usuario).

## 1.4. Referencias

- `README.md` — descripción general del proyecto y requerimientos de la
  Evaluación 1.
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
fichas de caso de uso y los requisitos no funcionales del sistema.

# 2. Descripción General

Esta sección describe los factores que afectan al producto **Ensambla.me** y a
sus requisitos, sin detallar aún los requisitos en sí (eso se hace en la sección
3).

## 2.1. Perspectiva del Producto

Ensambla.me es un producto independiente: un sitio web frontend (HTML, CSS y
JavaScript puro, apoyado en el framework Bootstrap para estilos y componentes)
que no depende de ni se integra con otros sistemas externos en esta entrega. No
existe backend ni base de datos; toda la información de productos, usuarios y
carrito se maneja del lado del cliente (arreglos JavaScript y `localStorage`).

Además del catálogo tradicional, Ensambla.me se diferencia por incorporar un
asistente de armado por componentes que guía al cliente, categoría por
categoría, en la construcción de una PC gamer completa o por módulos.

La estructura del `index.html` referencia archivos separados por sección
(encabezado, navegación, aside, cuerpo, pie de página), los cuales se combinan
en tiempo de carga para formar cada página del sitio.

## 2.2. Funciones del Producto

Las funciones del sistema se agrupan en dos grandes áreas:

**Tienda (pública):**
- Navegación entre páginas mediante menú superior con logo y acceso al carrito.
- Visualización de catálogo de productos (imagen, nombre, precio) y su detalle.
- Asistente de armado de PC gamer (*Ensambla.me*): selección guiada de
  componentes por categoría (CPU, placa madre, RAM, almacenamiento, fuente de
  poder, gabinete, refrigeración, tarjeta gráfica, periféricos), donde elegir un
  componente habilita las opciones relacionadas para las siguientes categorías;
  permite armar el equipo completo o trabajar solo por módulos (ej. solo
  actualizar almacenamiento) y agregar el armado resultante al carrito.
- Carrito de compras: agregar productos, ver contenido, persistencia en
  `localStorage`.
- Registro de nuevos usuarios e inicio de sesión.
- Página "Nosotros" con información de la empresa y desarrolladores.
- Sección de blogs con listado y detalle de artículos.
- Formulario de contacto para envío de mensajes internos.

**Administración (protegida):**
- Autenticación y control de acceso según rol de usuario.
- Home administrativo con menú vertical.
- Mantenedor de Productos: listar, crear y editar.
- Mantenedor de Usuarios: listar, crear y editar.
- Vista de solo lectura de productos y órdenes para el rol Administrador logistico.

## 2.3. Características de los Usuarios

El sistema contempla tres tipos de perfiles de usuario:

- **Administrador**: acceso total al sistema, incluyendo los mantenedores de
  Producto y Usuario. Se espera un nivel de manejo de PC a nivel de usuario, sin
  necesidad de conocimientos técnicos avanzados.
- **Administrador logistico**: solo puede visualizar el listado y detalle de productos, y el
  listado y detalle de órdenes. No tiene acceso a ninguna otra funcionalidad
  administrativa. Se espera un nivel de manejo de PC básico.
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

## 2.5. Suposiciones y Dependencias

- Se asume que el usuario accede desde un navegador web moderno con soporte de
  `localStorage` y JavaScript habilitado.
- Se asume que los datos de productos y usuarios de prueba (arreglos JS) son
  representativos para efectos de la demostración, y que no se requiere
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
- Panel de reportes y estadísticas para el rol Administrador.
- Recuperación de contraseña y verificación de correo electrónico en el
  registro.
- Motor de validación automática de compatibilidad técnica entre componentes
  del armado (ej. socket de CPU, tipo de memoria RAM, formato de gabinete,
  potencia de la fuente de poder).

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
- **Web Storage API (`localStorage`)**: utilizada para persistir el contenido
  del carrito de compras en el navegador del cliente.

### 3.1.4 Interfaces de comunicación

En esta entrega el sistema no se comunica con servidores externos ni APIs: es un
sitio estático que se ejecuta completamente en el navegador del cliente. No
aplican protocolos de comunicación adicionales.

## 3.2 Requisitos funcionales

> **RF-01 — Registrar usuario**
>
> Actores: Cliente
>
> Descripción: El cliente debe poder registrarse en el sistema completando un
> formulario con nombre (requerido, máx. 50), apellidos (requerido, máx. 100),
> correo (requerido, máx. 100, cumpliendo con regex de validacion), fecha de
> nacimiento (opcional), región y comuna (seleccionadas desde arreglos JS, la
> comuna se actualiza al cambiar la región) y dirección (requerida, máx. 300).
> Estas son las mismas reglas usadas por el mantenedor "Crear usuario" del
> administrador.

> **RF-02 — Iniciar sesión**
>
> Actores: Cliente, Administrador logistico, Administrador
>
> Descripción: El usuario debe poder iniciar sesión con correo (requerido, máx.
> 100) y contraseña (requerida, entre 4 y 10 caracteres). Según el tipo de
> usuario autenticado, el sistema debe redirigir y habilitar las funcionalidades
> correspondientes a su rol.

> **RF-03 — Visualizar catálogo de productos**
>
> Actores: Cliente
>
> Descripción: El cliente debe poder ver, en la página de inicio y en la página
> de productos, un listado de productos con imagen, nombre y precio, generado
> dinámicamente desde un arreglo de JavaScript.

> **RF-04 — Ver detalle de producto**
>
> Actores: Cliente
>
> Descripción: Al hacer clic sobre un producto del listado, el cliente debe ser
> redirigido a una vista de detalle del producto, donde puede añadirlo al
> carrito de compras.

> **RF-05 — Agregar producto al carrito**
>
> Actores: Cliente
>
> Descripción: El cliente debe poder agregar un producto al carrito de compras
> desde la vista de listado de productos o desde el detalle de producto.

> **RF-06 — Gestionar carrito de compras**
>
> Actores: Cliente
>
> Descripción: El cliente debe poder visualizar el contenido del carrito de
> compras. El carrito se implementa como un arreglo de productos en JavaScript,
> se renderiza desde dicho arreglo, y su contenido se persiste en `localStorage`
> para mantenerse entre sesiones.

> **RF-07 — Armar PC gamer por componentes**
>
> Actores: Cliente
>
> Descripción: El cliente debe poder utilizar el asistente de armado
> (*Ensambla.me*) para construir una PC gamer seleccionando, categoría por
> categoría (CPU, placa madre, RAM, almacenamiento, fuente de poder, gabinete,
> refrigeración, tarjeta gráfica, periféricos), los componentes deseados. Al
> seleccionar un componente, el sistema debe mostrar únicamente las opciones
> relacionadas disponibles para la siguiente categoría. El cliente puede optar
> por completar el armado de todas las categorías (equipo completo) o
> seleccionar solo algunos módulos de forma independiente (ej. solo
> almacenamiento). Al finalizar, el cliente puede agregar el conjunto de
> componentes armado al carrito de compras.

> **RF-08 — Enviar mensaje de contacto**
>
> Actores: Cliente
>
> Descripción: El cliente debe poder enviar un mensaje interno a la empresa
> mediante un formulario de contacto con nombre (requerido, máx. 100), correo
> (requerido, máx. 100, restringido a los dominios permitidos) y comentario
> (requerido, máx. 500).

> **RF-09 — Consultar blogs**
>
> Actores: Cliente
>
> Descripción: El cliente debe poder visualizar un listado de artículos de blog
> (imagen, título, descripción corta) y acceder al detalle de al menos dos
> artículos (imagen, título, descripción larga).

> **RF-10 — Mantenedor de Productos**
>
> Actores: Administrador
>
> Descripción: El administrador debe poder listar todos los productos, crear un
> nuevo producto y editar uno existente, ingresando: código (requerido, texto,
> mín. 3 caracteres), nombre (requerido, máx. 100), descripción (opcional, máx.
> 500), precio (requerido, mín. 0, admite decimales), stock (requerido, mín. 0,
> solo enteros), stock crítico (opcional, entero, muestra alerta cuando el stock
> sea igual o inferior a este valor), categoría (requerida, mediante select) e
> imagen (opcional).

> **RF-11 — Mantenedor de Usuarios**
>
> Actores: Administrador
>
> Descripción: El administrador debe poder listar todos los usuarios, crear un
> nuevo usuario y editar uno existente, con las mismas reglas de campos que
> RF-01, más un campo adicional de tipo de usuario (select: Administrador,
> Cliente o Administrador logistico), visible solo en esta vista administrativa.

> **RF-12 — Visualizar productos y órdenes (rol Administrador logistico)**
>
> Actores: Administrador logistico
>
> Descripción: El administrador logístico debe poder visualizar el listado y
> detalle de productos, y el listado y detalle de órdenes, en modo de solo
> lectura. Ninguna otra funcionalidad administrativa debe estar visible ni
> accesible para este rol.

## 3.3 Requisitos no funcionales

### 3.3.1 Requisitos de rendimiento

Al tratarse de un sitio estático sin backend, el 95% de las vistas debe cargar
completamente en menos de 2 segundos en una conexión de banda ancha estándar,
dado que no existen llamadas a servidor ni consultas a base de datos en esta
entrega.

### 3.3.2 Seguridad

- Todas las contraseñas ingresadas en los formularios deben enmascararse (tipo
  `password`) en pantalla.
- Las vistas del panel administrativo deben quedar inaccesibles para un usuario
  que no haya iniciado sesión.
- Las funcionalidades visibles para el rol Administrador logistico deben
  restringirse a únicamente productos y órdenes en modo lectura; el resto de
  opciones administrativas no debe renderizarse para este rol.
- Todos los formularios (registro, login, contacto, producto, usuario) deben
  validarse en tiempo real en el cliente, mostrando mensajes de error y
  sugerencias personalizados antes de permitir el envío.

### 3.3.3 Fiabilidad

Al no depender de un backend, el sistema no debe presentar errores de carga de
página bajo uso normal del navegador; los únicos incidentes esperables
corresponden a errores de validación de formularios, que deben ser gestionados y
comunicados claramente al usuario sin interrumpir la navegación.

### 3.3.4 Disponibilidad

Al ser un sitio 100% estático (sin servidor de aplicación ni base de datos), la
disponibilidad depende únicamente del servicio de hosting/repositorio utilizado
para publicarlo, esperando una disponibilidad cercana al 100% del tiempo.

### 3.3.5 Mantenibilidad

El sitio debe mantenerse mediante la separación de cada sección de la página
(encabezado, navegación, aside, cuerpo, pie de página) en archivos HTML
independientes referenciados desde `index.html`, y mediante una hoja de estilos
CSS externa única. El mantenimiento (agregar productos de prueba, ajustar
validaciones, etc.) puede ser realizado directamente por el desarrollador
editando estos archivos.

### 3.3.6 Portabilidad

El sistema debe funcionar correctamente en cualquier navegador web moderno
(Chrome, Firefox, Edge) sin depender de un sistema operativo, compilador o
plataforma de desarrollo específica, dado que utiliza únicamente HTML, CSS,
JavaScript y Bootstrap.

## 3.4 Otros Requisitos

- El proyecto debe mantenerse en un repositorio Git/GitHub público, con
  historial de commits claros y coherentes que documenten el avance del
  desarrollo, ya que este historial será evaluado como parte de la ronda de
  preguntas de la Entrega I.
