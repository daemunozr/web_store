/*
 * Carrito de compras (RF-05, RF-06) y contador del menu (RF-14 CA2).
 *
 * El carrito se guarda en localStorage bajo la unica clave "carrito" (3.1.3):
 * un arreglo con una entrada por linea, cada una con su numero de linea, su
 * producto, su cantidad y, si pertenece a un armado, el identificador de ese
 * armado (RF-07). Un contenido invalido o corrupto deja el carrito vacio en
 * lugar de interrumpir la ejecucion (RNF-03 CA4).
 */

const CLAVE_CARRITO = "carrito";

/* --------------------------------------------------------- Lectura y escritura */
function leerCarrito() {
	try {
		const guardado = window.localStorage.getItem(CLAVE_CARRITO);
		if (!guardado) return [];

		const lineas = JSON.parse(guardado);
		if (!Array.isArray(lineas)) throw new Error("el contenido no es un arreglo");

		// Se descartan las lineas que ya no corresponden a un producto vigente y
		// se ajustan las cantidades al stock actual, que pudo bajar desde que se
		// guardo el carrito: la linea que ya no tiene unidades se quita.
		const ocupadas = {};
		return lineas
			.filter((linea) => linea && typeof linea.producto === "string" && Datos.producto(linea.producto))
			.map((linea) => {
				const stock = Number(Datos.producto(linea.producto).stock) || 0;
				const libres = Math.max(0, stock - (ocupadas[linea.producto] ?? 0));
				const cantidad = Math.min(Math.max(1, Math.trunc(Number(linea.cantidad)) || 1), libres);
				ocupadas[linea.producto] = (ocupadas[linea.producto] ?? 0) + cantidad;
				return { producto: linea.producto, cantidad, armado: linea.armado || null };
			})
			.filter((linea) => linea.cantidad > 0)
			.map((linea, i) => ({ linea: i + 1, ...linea }));
	} catch (error) {
		console.error("carrito.js: contenido invalido en localStorage, el carrito parte vacio", error);
		// Se descarta el contenido ilegible para no repetir el error en cada lectura.
		try {
			window.localStorage.removeItem(CLAVE_CARRITO);
		} catch (fallo) {
			console.error("carrito.js: tampoco se pudo limpiar la clave del carrito", fallo);
		}
		return [];
	}
}

function guardarCarrito(lineas) {
	const numeradas = lineas.map((linea, i) => ({ ...linea, linea: i + 1 }));
	try {
		window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(numeradas));
	} catch (error) {
		console.error("carrito.js: no se pudo guardar el carrito", error);
	}
	pintarContador();
	return numeradas;
}

/* ------------------------------------------------------------------ Consultas */
const cantidadItems = () => leerCarrito().reduce((total, linea) => total + linea.cantidad, 0);

const subtotalDeLinea = (linea) => (Datos.producto(linea.producto)?.precio ?? 0) * linea.cantidad;

const totalCarrito = () => leerCarrito().reduce((total, linea) => total + subtotalDeLinea(linea), 0);

/* --------------------------------------------------------- Reglas de stock
   Las unidades de un producto en el carrito, sumando sus lineas sueltas y las
   de cualquier armado, nunca superan su stock (RF-05, RF-06, RF-07). */
/** Unidades del producto en el carrito, sin contar la linea indicada. */
const unidadesEnCarrito = (sku, lineas = leerCarrito(), excluirLinea = null) =>
	lineas
		.filter((linea) => linea.producto === sku && linea.linea !== excluirLinea)
		.reduce((total, linea) => total + linea.cantidad, 0);

/** "1 unidad" o "N unidades". */
const unidades = (n) => `${n} ${n === 1 ? "unidad" : "unidades"}`;

/** Unidades que todavia pueden agregarse al carrito sin superar el stock. */
function disponible(sku, lineas = leerCarrito(), excluirLinea = null) {
	const stock = Number(Datos.producto(sku)?.stock) || 0;
	return Math.max(0, stock - unidadesEnCarrito(sku, lineas, excluirLinea));
}

/* ---------------------------------------------------------------- Operaciones */
/**
 * Agrega un producto; si ya esta suelto en el carrito, suma su cantidad (RF-05 CA2).
 * Rechaza la operacion si no hay stock suficiente.
 */
function agregarProducto(sku, cantidad = 1) {
	const producto = Datos.producto(sku);
	if (!producto) {
		console.error(`carrito.js: no existe el producto "${sku}"`);
		return;
	}

	const lineas = leerCarrito();

	if (Number(producto.stock) <= 0) {
		confirmar(`"${producto.nombre}" no tiene stock disponible.`);
		return;
	}

	const libres = disponible(sku, lineas);
	if (cantidad > libres) {
		const enCarrito = unidadesEnCarrito(sku, lineas);
		confirmar(
			libres === 0
				? `Ya tienes en el carrito todo el stock de "${producto.nombre}" (${unidades(enCarrito)}).`
				: `Solo ${libres === 1 ? "queda" : "quedan"} ${unidades(libres)} de "${producto.nombre}" y ya tienes ${enCarrito} en el carrito.`,
		);
		return;
	}

	const existente = lineas.find((linea) => linea.producto === sku && !linea.armado);

	if (existente) {
		existente.cantidad += cantidad;
	} else {
		lineas.push({ linea: lineas.length + 1, producto: sku, cantidad, armado: null });
	}

	guardarCarrito(lineas);
	confirmar(`"${producto.nombre}" se agrego al carrito.`);
}

/**
 * Agrega un armado completo: una linea por componente, todas con el mismo
 * agrupador (RF-07). Si algun componente no tiene stock disponible, el armado
 * no se agrega y se devuelve null.
 */
function agregarArmado(skus) {
	if (!skus.length) return null;

	const identificador = `ARM-${Date.now().toString(36).toUpperCase()}`;
	const lineas = leerCarrito();
	const sinStock = [];

	// Cada componente se agrega a "lineas" antes de revisar el siguiente, asi un
	// mismo producto repetido en el armado tambien cuenta contra su stock.
	skus.forEach((sku) => {
		const producto = Datos.producto(sku);
		if (!producto) return;
		if (disponible(sku, lineas) < 1) {
			sinStock.push(producto.nombre);
			return;
		}
		lineas.push({ linea: lineas.length + 1, producto: sku, cantidad: 1, armado: identificador });
	});

	if (sinStock.length) {
		confirmar(`Sin stock suficiente para: ${sinStock.join(", ")}. El armado no se agrego.`);
		return null;
	}

	guardarCarrito(lineas);
	confirmar(`Armado agregado al carrito con ${skus.length} ${skus.length === 1 ? "componente" : "componentes"}.`);
	return identificador;
}

function eliminarLinea(numero) {
	guardarCarrito(leerCarrito().filter((linea) => linea.linea !== numero));
}

function eliminarArmado(identificador) {
	guardarCarrito(leerCarrito().filter((linea) => linea.armado !== identificador));
}

/** Cambia la cantidad de una linea; nunca por debajo de 1 ni por sobre el stock (RF-06 CA3). */
function cambiarCantidad(numero, cantidad) {
	const lineas = leerCarrito();
	const linea = lineas.find((l) => l.linea === numero);
	if (!linea) return;

	const pedida = Math.max(1, Math.trunc(Number(cantidad)) || 1);
	const tope = Math.max(1, disponible(linea.producto, lineas, numero));

	if (pedida > tope) {
		confirmar(`Solo puedes llevar ${unidades(tope)} de "${Datos.producto(linea.producto).nombre}".`);
	}

	linea.cantidad = Math.min(pedida, tope);
	guardarCarrito(lineas);
}

function vaciarCarrito() {
	guardarCarrito([]);
}

/* ------------------------------------------------------- Avisos y contador */
/** Confirmacion visual cada vez que se agrega algo al carrito (RF-05 CA3). */
function confirmar(mensaje) {
	let contenedor = document.querySelector(".toast-container");
	if (!contenedor) {
		contenedor = document.createElement("div");
		contenedor.className = "toast-container position-fixed bottom-0 end-0 p-3";
		document.body.append(contenedor);
	}

	const aviso = document.createElement("output");
	aviso.className = "toast align-items-center text-bg-dark border-0 d-flex";
	aviso.innerHTML = `
		<div class="toast-body">${escapar(mensaje)}</div>
		<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
	`;
	contenedor.append(aviso);

	const toast = new bootstrap.Toast(aviso, { delay: 3000 });
	aviso.addEventListener("hidden.bs.toast", () => aviso.remove());
	toast.show();
}

/** Mantiene al dia el contador de items del menu (RF-14 CA2). */
function pintarContador() {
	const contador = document.getElementById("contador-carrito");
	if (!contador) return;

	const total = cantidadItems();
	contador.replaceChildren(
		document.createTextNode(String(total)),
		Object.assign(document.createElement("span"), {
			className: "visually-hidden",
			textContent: " productos en el carrito",
		}),
	);
}

/* ------------------------------------------------------- Vista del carrito */
const imagenDeProducto = (producto, clase) =>
	producto.imagen
		? `<img src="${Rutas.recurso(producto.imagen)}" alt="${escapar(producto.nombre)}" class="${clase}">`
		: `<p class="sin-imagen ${clase} mb-0"></p>`;

function filaDeLinea(linea, lineas, nivel = 2) {
	const producto = Datos.producto(linea.producto);
	// Tope de esta linea: el stock menos lo que ocupan las demas lineas del producto.
	const tope = Math.max(linea.cantidad, disponible(producto.sku, lineas, linea.linea));

	return `
		<article class="linea-carrito card mb-3" data-linea="${linea.linea}">
			<div class="card-body d-flex flex-wrap align-items-center gap-3">
				${imagenDeProducto(producto, "imagen-linea")}

				<div class="flex-grow-1">
					<h${nivel} class="h6 mb-1">
						<a class="enlace-producto" href="${Rutas.a(`producto.html?sku=${encodeURIComponent(producto.sku)}`)}">${escapar(producto.nombre)}</a>
					</h${nivel}>
					<p class="etiqueta-categoria mb-1">${escapar(Datos.nombreCategoria(producto.categoria))}</p>
					<p class="small mb-0">Precio unitario: ${Datos.precio(producto.precio)}</p>
					<p class="small text-secondary mb-0">Puedes llevar hasta ${unidades(tope)}.</p>
				</div>

				<div>
					<label class="form-label small mb-1" for="cantidad-${linea.linea}">Cantidad</label>
					<input
						type="number"
						class="form-control cantidad-linea"
						id="cantidad-${linea.linea}"
						name="cantidad-${linea.linea}"
						min="1"
						max="${tope}"
						step="1"
						value="${linea.cantidad}"
						autocomplete="off"
						data-accion="cantidad"
					>
				</div>

				<p class="precio mb-0 text-end">${Datos.precio(subtotalDeLinea(linea))}</p>

				<button type="button" class="btn btn-sm btn-outline-danger" data-accion="eliminar">
					Eliminar
				</button>
			</div>
		</article>
	`;
}

function grupoDeArmado(identificador, lineas, todas) {
	const precio = lineas.reduce((total, linea) => total + subtotalDeLinea(linea), 0);

	return `
		<section class="grupo-armado mb-4" data-armado="${escapar(identificador)}">
			<header class="encabezado-armado d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
				<div>
					<h2 class="h6 mb-1">Armado personalizado</h2>
					<p class="small mb-0">Conjunto ${escapar(identificador)} &middot; ${lineas.length} ${lineas.length === 1 ? "componente" : "componentes"}</p>
				</div>
				<div class="d-flex align-items-center gap-3">
					<p class="precio mb-0">${Datos.precio(precio)}</p>
					<button type="button" class="btn btn-sm btn-outline-danger" data-accion="eliminar-armado">
						Quitar el armado
					</button>
				</div>
			</header>
			<div class="p-3">
				${lineas.map((linea) => filaDeLinea(linea, todas, 3)).join("")}
			</div>
		</section>
	`;
}

/** Dibuja el contenido del carrito y su total (RF-06). */
function renderizarCarrito() {
	const contenedor = document.getElementById("contenido-carrito");
	const zonaTotal = document.getElementById("total-carrito");
	if (!contenedor) return;

	const lineas = leerCarrito();

	if (!lineas.length) {
		contenedor.innerHTML = `
			<div class="estado-vacio">
				<p class="mb-3">Tu carrito esta vacio.</p>
				<a class="btn btn-primary" href="${Rutas.a("productos.html")}">Ver el catalogo</a>
			</div>
		`;
		if (zonaTotal) zonaTotal.textContent = Datos.precio(0);
		pintarContador();
		return;
	}

	const sueltas = lineas.filter((linea) => !linea.armado);
	const armados = lineas
		.filter((linea) => linea.armado)
		.reduce((grupos, linea) => {
			(grupos[linea.armado] ??= []).push(linea);
			return grupos;
		}, {});

	contenedor.innerHTML =
		Object.entries(armados)
			.map(([identificador, suyas]) => grupoDeArmado(identificador, suyas, lineas))
			.join("") + sueltas.map((linea) => filaDeLinea(linea, lineas)).join("");

	if (zonaTotal) zonaTotal.textContent = Datos.precio(totalCarrito());
	pintarContador();
}

/** Acciones de la vista del carrito: cambiar cantidad, eliminar linea o armado. */
function conectarVistaCarrito() {
	const contenedor = document.getElementById("contenido-carrito");
	if (!contenedor) return;

	contenedor.addEventListener("click", (evento) => {
		const boton = evento.target.closest("[data-accion]");
		if (!boton) return;

		if (boton.dataset.accion === "eliminar") {
			eliminarLinea(Number(boton.closest("[data-linea]").dataset.linea));
			renderizarCarrito();
		}

		if (boton.dataset.accion === "eliminar-armado") {
			eliminarArmado(boton.closest("[data-armado]").dataset.armado);
			renderizarCarrito();
		}
	});

	contenedor.addEventListener("change", (evento) => {
		const campo = evento.target.closest('[data-accion="cantidad"]');
		if (!campo) return;

		cambiarCantidad(Number(campo.closest("[data-linea]").dataset.linea), campo.value);
		renderizarCarrito();
	});

	renderizarCarrito();
}

/* --------------------------------------------------------------- Arranque */
document.addEventListener("includes:loaded", () => {
	pintarContador();
	conectarVistaCarrito();

	// Boton "Anadir al carrito" en el listado y en el detalle (RF-05 CA1).
	document.addEventListener("click", (evento) => {
		const boton = evento.target.closest("[data-agregar]");
		if (!boton) return;

		evento.preventDefault();
		agregarProducto(boton.dataset.agregar, Number(boton.dataset.cantidad) || 1);
	});
});

window.Carrito = {
	leer: leerCarrito,
	agregar: agregarProducto,
	agregarArmado,
	eliminarLinea,
	eliminarArmado,
	cambiarCantidad,
	disponible,
	vaciar: vaciarCarrito,
	total: totalCarrito,
	cantidadItems,
	renderizar: renderizarCarrito,
	confirmar,
	imagenDeProducto,
};
