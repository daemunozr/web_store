# Instrucciones para el desarrollo de la Evaluacion 2 (30%)
**Escuela de Informatica y Telecomunicaciones - Duoc UC**

## Objetivos para la evaluacion 2
En esta evaluacion, el equipo continuara desarrollando su tienda online con un enfoque en el frontend, utilizando React y añadiendo nuevos flujos de navegacion. Se proporcionara un template en HTML como guia para ayudar a los estudiantes a tomar ideas y actualizar sus proyectos con el framework y por ultimo deberan realizar una variedad de pruebas para asegurar la calidad y el correcto funcionamiento de los componentes.

---

## Requisitos del proyecto

1. **Migracion de HTML a React:**
   * Convertir las paginas HTML existentes en componentes de React reutilizables.
   * Asegurarse de que cada componente maneje su propio estado y propiedades de manera eficiente.

2. **Archivo de datos en JavaScript:**
   * Crear un archivo JavaScript que actue como una fuente de datos simulada (similar a una base de datos) para la aplicacion.
   * Implementar funciones para operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los datos dentro del archivo JS.

3. **Integracion de persistencia:**
   * Conectar el archivo de persistencia con los componentes de React para gestionar datos en tiempo real y actualizar la interfaz de usuario segun sea necesario.

4. **Diseño responsivo utilizando Bootstrap:**
   * Incorporar Bootstrap para asegurar que el diseño sea responsivo para proporcionar una experiencia de usuario optima en moviles, tabletas y escritorios.

5. **Vistas adicionales:**
   * Añadir nuevas vistas basadas en los requerimientos actuales del negocio o cliente, como paneles de administracion o paginas de detalles de productos.

6. **Interactividad mejorada:**
   * Incorporar caracteristicas interactivas adicionales utilizando React, como formularios avanzados, filtros de busqueda y navegacion mejorada.

7. **Configuracion de pruebas:**
   * Configurar el entorno de pruebas usando Jasmine y Karma para ejecutar pruebas unitarias en componentes de React.

8. **Desarrollo de pruebas unitarias:**
   * Escribir pruebas para verificar la logica y el comportamiento de los componentes, asegurando que cada parte de la aplicacion funcione como se espera.

> **Buenas Practicas:**  
> Al crear un componente en React, sigue el principio de **"Single Responsibility"** (Responsabilidad Unica). Un componente debe tener una unica responsabilidad o proposito en la aplicacion. Esto no solo hace que el componente sea mas facil de entender y probar, sino que tambien mejora la reutilizacion. Asegurate de que el componente tenga un nombre claro y descriptivo, utilice `props` para recibir datos y funciones necesarias, y maneje su propio estado solo cuando sea necesario.

---

## Actualizacion del flujo entre paginas

El proyecto se divide en dos areas principales de navegacion y flujo de vistas:

### 1. Vistas de la Tienda (Publicas)
Esta vista es de manera publica y sera la cara visible de la tienda. Se reorganiza la estructura de las paginas y se añaden otras complementarias:

* **Pagina Principal / Home**
* **Productos / Detalle Productos**
* **Registro Usuario / Iniciar Sesion**
* **Nosotros**
* **Blogs / Detalle Blog #1 / Detalle Blog #2**
* **Contacto**
* **Categorias:** Vista que separa los productos por categorias (ej. Categoria 1, Categoria 2, etc.).
* **Ofertas:** Vista que muestra todos los productos en oferta.
* **Comprar / Carrito / Checkout:** 
  * Se incorpora Checkout (Paso de Pago): El cliente introduce la direccion de envio y selecciona opciones de entrega.
  * *Nota:* Si el usuario ha iniciado sesion, toda esta informacion se añadira de forma automatica.
  * Se incorporan vistas de confirmacion: **Pago Correcto** y **Pago Con Error** (con resumen del pedido).

### 2. Vista del Administrador (Panel de Control)
El desarrollo del sistema administrativo sera un proceso colaborativo, donde el docente desempeñara un papel fundamental al proponer y guiar el flujo de trabajo.

Flujo de navegacion del Admin:
* **Home / Dashboard:** Resumen de actividades (Compras, Productos, Usuarios, Estadisticas).
* **Ordenes / Boletas:** Mostrar boleta.
* **Producto:** Nuevo producto, Mostrar producto, Editar producto, Listado productos criticos, Reportes.
* **Categoria:** Nueva categoria, Editar categoria.
* **Usuario:** Nuevo usuario, Mostrar usuario, Editar usuario, Historial de compras.
* **Reportes**
* **Perfil**

---

## Propuesta de pruebas con Jasmine

*Alcance propuesto por el docente:* Utilizar **Jasmine** para escribir y ejecutar pruebas unitarias que aseguren la funcionalidad y calidad del codigo en una aplicacion React. A traves de estas pruebas, se verificara el renderizado, el manejo de propiedades (`props`), el estado (`state`) y los eventos en los componentes React.

### 1. Pruebas de renderizado
* **Renderizado correcto:** Escribe pruebas que verifiquen que los componentes se rendericen con los datos proporcionados.
  * *Tarea:* Asegurate de que los componentes de lista rendericen todos los elementos de un conjunto de datos.
* **Renderizado condicional:** Crea pruebas para comprobar que los componentes muestren y/o oculten elementos segun las condiciones especificadas.
  * *Tarea:* Verifica que un mensaje de error solo se muestre cuando hay un error presente.

### 2. Pruebas de propiedades (props)
* **Propiedades Recibidas:** Desarrolla pruebas que confirmen que los componentes reciben y utilizan las propiedades adecuadas.
  * *Tarea:* Asegurate de que un componente de boton recibe correctamente la etiqueta y la funcion de evento `onClick`.

### 3. Pruebas de Estado (state)
* **Gestion del Estado:** Implementa pruebas que comprueben la logica de cambios de estado dentro de los componentes.
  * *Tarea:* Verifica que el estado de un formulario cambia correctamente cuando el usuario introduce texto.

### 4. Pruebas de Eventos
* **Simulacion de Eventos:** Simula eventos de usuario para verificar que los componentes reaccionen como se espera.
  * *Tarea:* Simula un clic en un boton y comprueba que el estado del componente cambie o que se ejecute una funcion especifica.

---

## Instrucciones para la entrega II

La entrega consiste en 2 partes:
1. **Entrega y presentacion de la solucion de la propuesta.**
2. **Ronda de preguntas abiertas:** Cada integrante del grupo debera responder a preguntas abiertas formuladas por el docente para evaluar la comprension tecnica y los cambios realizados en GitHub durante el desarrollo frontend.

### Requisitos de Entrega (Encargo)
* El equipo debera definir los requerimientos, herramientas y propuestas del proyecto mediante un **documento ERS (actualizado V2)**.
* **Documento de cobertura del testing:** Propuesta y analisis de los test realizados.
* **Enlace GitHub publico** del proyecto frontend.
* **Proyecto frontend comprimido.**

### Presentacion del caso
* **Tiempo:** 15 minutos de exposicion por equipo + 5 minutos para la ronda de preguntas.
* **Demostracion:** Presentacion del desarrollo funcional integrado con el backend y frontend.
* **Evaluacion:** Ronda de preguntas abiertas individuales.