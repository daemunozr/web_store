/*
 * Asistente de armado de PC gamer (RF-07).
 *
 * Presenta las categorias de componentes en el orden definido en los datos, una
 * a la vez. Al escoger un componente, la categoria siguiente lista solo las
 * opciones asociadas a el en la tabla de compatibilidad estatica: el sistema no
 * calcula compatibilidad tecnica real (ver 1.2 y 2.6 del ERS).
 *
 * Dos modos: equipo completo (recorre todas las categorias) y por modulos
 * (permite omitir categorias y finalizar antes con lo ya seleccionado).
 */

const estado = {
	modo: null, // "completo" | "modulos"
	indice: 0,
	elecciones: [], // { categoria, sku } con sku = null cuando se omite
	agregado: false,
};

const categoriasDelArmado = () => Datos.categoriasDeArmado();

const elegidos = () => estado.elecciones.filter((eleccion) => eleccion.sku);

/* --------------------------------------------------------- Zonas de la vista */
const zonaModo = () => document.getElementById("modo-armado");
const zonaPasos = () => document.getElementById("pasos-armado");
const zonaPaso = () => document.getElementById("paso-actual");
const zonaResumen = () => document.getElementById("resumen-armado");

/* ------------------------------------------------------------- Compatibilidad
   Las opciones de una categoria se filtran con los admisibles del componente
   escogido en la categoria inmediatamente anterior. Si esa categoria se omitio,
   no hay par en la tabla que aplicar y se ofrece la categoria completa. */
function opcionesDe(indice) {
	const categorias = categoriasDelArmado();
	const categoria = categorias[indice];
	const productos = Datos.productosDe(categoria.codigo);

	if (indice === 0) return productos;

	const anterior = estado.elecciones[indice - 1];
	if (!anterior || !anterior.sku) return productos;

	const admisibles = Datos.admisibles(anterior.sku);
	return productos.filter((producto) => admisibles.includes(producto.sku));
}

/* ---------------------------------------------------------- Selector de modo */
function pintarModo() {
	const zona = zonaModo();
	if (!zona) return;

	if (estado.modo) {
		const texto = estado.modo === "completo" ? "Equipo completo" : "Por modulos";
		zona.innerHTML = `
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
				<p class="mb-0">Modo de armado: <strong>${texto}</strong></p>
				<button type="button" class="btn btn-sm btn-outline-primary" data-accion="reiniciar">
					Empezar de nuevo
				</button>
			</div>
		`;
		return;
	}

	zona.innerHTML = `
		<h2 class="h5 titulo-seccion mb-3">Como quieres armarlo</h2>
		<div class="row row-cols-1 row-cols-md-2 g-3">
			<div class="col">
				<article class="card h-100">
					<div class="card-body d-flex flex-column">
						<h3 class="h6 card-title">Equipo completo</h3>
						<p class="card-text small">
							Recorres las ${categoriasDelArmado().length} categorias, desde el procesador hasta
							los perifericos, y al terminar agregas todo el conjunto al carrito.
						</p>
						<button type="button" class="btn btn-primary mt-auto" data-modo="completo">
							Armar equipo completo
						</button>
					</div>
				</article>
			</div>
			<div class="col">
				<article class="card h-100">
					<div class="card-body d-flex flex-column">
						<h3 class="h6 card-title">Por modulos</h3>
						<p class="card-text small">
							Escoges solo lo que necesitas (por ejemplo almacenamiento y memoria), omites el
							resto y finalizas cuando quieras.
						</p>
						<button type="button" class="btn btn-outline-primary mt-auto" data-modo="modulos">
							Armar por modulos
						</button>
					</div>
				</article>
			</div>
		</div>
	`;
}

/* ------------------------------------------------------------ Lista de pasos */
function pintarPasos() {
	const zona = zonaPasos();
	if (!zona) return;

	if (!estado.modo) {
		zona.replaceChildren();
		return;
	}

	zona.innerHTML = categoriasDelArmado()
		.map((categoria, i) => {
			const eleccion = estado.elecciones[i];
			let clase = "";
			if (i === estado.indice && !estado.agregado) clase = "paso-actual";
			else if (eleccion && eleccion.sku) clase = "paso-listo";
			else if (eleccion) clase = "paso-omitido";

			return `<li class="${clase}">${escapar(categoria.nombre)}</li>`;
		})
		.join("");
}

/* ------------------------------------------------------------- Paso actual */
function tarjetaDeOpcion(producto, seleccionado) {
	// Un componente sin stock se muestra, pero no puede escogerse (RF-07).
	const sinStock = Number(producto.stock) <= 0;
	return `
		<div class="col">
			<article class="card opcion-componente">
				<div class="card-body">
					<div class="form-check">
						<input
							class="form-check-input"
							type="radio"
							name="componente"
							id="opcion-${escapar(producto.sku)}"
							value="${escapar(producto.sku)}"
							${seleccionado && !sinStock ? "checked" : ""}
							${sinStock ? "disabled" : ""}
						>
						<label class="form-check-label fw-semibold" for="opcion-${escapar(producto.sku)}">
							${escapar(producto.nombre)}${sinStock ? " (sin stock)" : ""}
						</label>
					</div>
					<p class="precio mb-1">${producto.precio === 0 ? "Gratis" : Datos.precio(producto.precio)}</p>
					<p class="small text-secondary mb-0">${escapar(producto.descripcion)}</p>
				</div>
			</article>
		</div>
	`;
}

function pintarPaso() {
	const zona = zonaPaso();
	if (!zona) return;

	if (!estado.modo || estado.agregado) {
		zona.replaceChildren();
		return;
	}

	const categorias = categoriasDelArmado();

	// Recorridas todas las categorias se pasa al resumen (RF-07 CA4).
	if (estado.indice >= categorias.length) {
		zona.replaceChildren();
		return;
	}

	const categoria = categorias[estado.indice];
	const opciones = opcionesDe(estado.indice);
	const elegido = estado.elecciones[estado.indice]?.sku ?? "";
	const esUltima = estado.indice === categorias.length - 1;

	const cuerpo = opciones.length
		? `<div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
				${opciones.map((producto) => tarjetaDeOpcion(producto, producto.sku === elegido)).join("")}
		   </div>`
		: `<div class="estado-vacio">
				<p class="mb-0">
					No hay componentes de esta categoria compatibles con tu seleccion anterior. Puedes
					omitirla o volver atras y cambiar el componente previo.
				</p>
		   </div>`;

	const anterior = estado.elecciones[estado.indice - 1];
	const nota =
		estado.indice > 0 && anterior?.sku
			? `<p class="small text-secondary">
					Filtrado segun tu eleccion anterior: <strong>${escapar(Datos.producto(anterior.sku)?.nombre ?? "")}</strong>.
			   </p>`
			: "";

	zona.innerHTML = `
		<h2 class="h5 titulo-seccion mb-1">
			Paso ${estado.indice + 1} de ${categorias.length}: ${escapar(categoria.nombre)}
		</h2>
		${nota}
		<form id="form-paso" class="mt-3">
			<fieldset>
				<legend class="visually-hidden">Componentes disponibles en ${escapar(categoria.nombre)}</legend>
				${cuerpo}
			</fieldset>

			<p class="text-danger small mt-2 d-none" id="error-paso" role="alert">
				Selecciona un componente para continuar.
			</p>

			<div class="d-flex flex-wrap gap-2 mt-3">
				${estado.indice > 0 ? '<button type="button" class="btn btn-outline-secondary" data-accion="volver">Volver</button>' : ""}
				${
					esUltima
						? '<button type="submit" class="btn btn-primary">Ver el resumen</button>'
						: '<button type="submit" class="btn btn-primary">Continuar</button>'
				}
				${
					estado.modo === "modulos"
						? '<button type="button" class="btn btn-outline-primary" data-accion="omitir">Omitir esta categoria</button>'
						: ""
				}
				${
					estado.modo === "modulos" && elegidos().length
						? '<button type="button" class="btn btn-success" data-accion="finalizar">Finalizar aqui</button>'
						: ""
				}
			</div>
		</form>
	`;
}

/* ---------------------------------------------------------------- Resumen */
function pintarResumen() {
	const zona = zonaResumen();
	if (!zona) return;

	const seleccion = elegidos();
	const categorias = categoriasDelArmado();

	// En modo equipo completo el conjunto se agrega una vez recorridas todas las
	// categorias (RF-07 CA4); en modo modulos se puede finalizar antes (CA3).
	const recorridoCompleto = estado.indice >= categorias.length;
	const puedeAgregar =
		!estado.agregado &&
		seleccion.length > 0 &&
		(estado.modo === "modulos" ? true : recorridoCompleto);

	if (!estado.modo || (!seleccion.length && !estado.agregado)) {
		zona.className = "";
		zona.replaceChildren();
		return;
	}

	const total = seleccion.reduce((suma, eleccion) => suma + (Datos.producto(eleccion.sku)?.precio ?? 0), 0);

	const filas = seleccion
		.map((eleccion) => {
			const producto = Datos.producto(eleccion.sku);
			return `
				<li class="d-flex justify-content-between gap-3 py-1">
					<span>
						<span class="etiqueta-categoria d-block">${escapar(Datos.nombreCategoria(eleccion.categoria))}</span>
						${escapar(producto.nombre)}
					</span>
					<span class="text-nowrap">${producto.precio === 0 ? "Gratis" : Datos.precio(producto.precio)}</span>
				</li>
			`;
		})
		.join("");

	let acciones = "";
	if (estado.agregado) {
		acciones = `
			<div class="d-flex flex-wrap gap-2">
				<a class="btn btn-primary" href="${Rutas.a("carrito.html")}">Ir al carrito</a>
				<button type="button" class="btn btn-outline-primary" data-accion="reiniciar">Armar otro equipo</button>
			</div>`;
	} else if (puedeAgregar) {
		acciones = `
			<div class="d-flex flex-wrap gap-2">
				<button type="button" class="btn btn-success" data-accion="agregar">Agregar el armado al carrito</button>
				${recorridoCompleto ? "" : '<button type="button" class="btn btn-outline-secondary" data-accion="seguir">Seguir eligiendo</button>'}
			</div>`;
	} else if (recorridoCompleto) {
		acciones = '<p class="small text-secondary mb-0">Vuelve atras y escoge al menos un componente para agregarlo al carrito.</p>';
	} else {
		acciones = '<p class="small text-secondary mb-0">Termina de recorrer las categorias para agregar el equipo completo al carrito.</p>';
	}

	const aviso = estado.agregado
		? '<div class="alert alert-success" role="alert">El armado se agrego al carrito como un conjunto.</div>'
		: "";

	zona.className = "resumen-armado p-3 mt-4";
	zona.innerHTML = `
		<h2 class="h5">Resumen del armado</h2>
		${aviso}
		<ul class="list-unstyled border-top border-bottom py-2 my-3">${filas}</ul>
		<p class="d-flex justify-content-between align-items-center">
			<span>Precio del conjunto (${seleccion.length} ${seleccion.length === 1 ? "componente" : "componentes"})</span>
			<span class="total">${Datos.precio(total)}</span>
		</p>
		${acciones}
	`;
}

function pintarTodo() {
	pintarModo();
	pintarPasos();
	pintarPaso();
	pintarResumen();
}

/* ------------------------------------------------------------- Operaciones */
function registrar(sku) {
	const categoria = categoriasDelArmado()[estado.indice].codigo;
	estado.elecciones[estado.indice] = { categoria, sku };

	// Cambiar un componente invalida lo elegido despues, que pudo filtrarse con el.
	estado.elecciones = estado.elecciones.slice(0, estado.indice + 1);
}

function avanzar() {
	estado.indice = Math.min(estado.indice + 1, categoriasDelArmado().length);
	pintarTodo();
}

function reiniciar() {
	estado.modo = null;
	estado.indice = 0;
	estado.elecciones = [];
	estado.agregado = false;
	pintarTodo();
}

function agregarAlCarrito() {
	const skus = elegidos().map((eleccion) => eleccion.sku);
	if (!skus.length) return;

	// Si falta stock de algun componente, carrito.js avisa y el armado sigue en pantalla.
	if (!Carrito.agregarArmado(skus)) return;
	estado.agregado = true;
	pintarTodo();
}

/* --------------------------------------------------------------- Arranque */
function conectarAsistente() {
	const contenedor = document.getElementById("paso-actual");
	if (!contenedor) return; // No es la vista del asistente.

	document.addEventListener("click", (evento) => {
		const boton = evento.target.closest("[data-modo], [data-accion]");
		if (!boton) return;

		if (boton.dataset.modo) {
			estado.modo = boton.dataset.modo;
			estado.indice = 0;
			estado.elecciones = [];
			estado.agregado = false;
			pintarTodo();
			return;
		}

		switch (boton.dataset.accion) {
			case "volver":
				estado.indice = Math.max(0, estado.indice - 1);
				pintarTodo();
				break;
			case "omitir":
				estado.elecciones[estado.indice] = {
					categoria: categoriasDelArmado()[estado.indice].codigo,
					sku: null,
				};
				avanzar();
				break;
			case "finalizar":
				estado.indice = categoriasDelArmado().length;
				pintarTodo();
				break;
			case "seguir":
				estado.indice = estado.elecciones.length;
				pintarTodo();
				break;
			case "agregar":
				agregarAlCarrito();
				break;
			case "reiniciar":
				reiniciar();
				break;
			default:
				break;
		}
	});

	// Envio del paso: exige un componente escogido salvo en modo modulos.
	document.addEventListener("submit", (evento) => {
		const formulario = evento.target.closest("#form-paso");
		if (!formulario) return;

		evento.preventDefault();
		const marcado = formulario.querySelector('input[name="componente"]:checked');

		if (!marcado) {
			formulario.querySelector("#error-paso")?.classList.remove("d-none");
			return;
		}

		registrar(marcado.value);
		avanzar();
	});

	pintarTodo();
}

document.addEventListener("includes:loaded", conectarAsistente);

window.Armado = { estado, opcionesDe, reiniciar };
