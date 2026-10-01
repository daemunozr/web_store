/*
 * Catalogo y detalle de producto (RF-03, RF-04) y barra lateral de categorias
 * (RF-14 CA3).
 *
 * Todo el listado se genera desde los datos de productos y no desde el marcado
 * de la vista: agregar un producto a los datos basta para que aparezca su
 * tarjeta al recargar (RF-03 CA1).
 */

/* --------------------------------------------- Barra lateral de categorias */
function renderizarCategorias() {
	const lista = document.getElementById("lista-categorias");
	if (!lista) return;

	const activa = new URLSearchParams(window.location.search).get("categoria") ?? "";

	lista.replaceChildren();
	Datos.categorias.forEach((categoria) => {
		const enlace = document.createElement("a");
		enlace.className = "list-group-item list-group-item-action";
		enlace.href = Rutas.a(`productos/?categoria=${encodeURIComponent(categoria.codigo)}`);
		enlace.textContent = categoria.nombre;
		if (categoria.codigo === activa) {
			enlace.classList.add("activa");
			enlace.setAttribute("aria-current", "page");
		}
		lista.append(enlace);
	});
}

/* ----------------------------------------------------- Tarjeta de producto */
function tarjetaDeProducto(producto, nivel = 3) {
	const enlace = Rutas.a(`producto/?sku=${encodeURIComponent(producto.sku)}`);
	const nombre = escapar(producto.nombre);
	const precio =
		producto.precio === 0
			? '<p class="precio precio-gratis mb-3">Gratis</p>'
			: `<p class="precio mb-3">${Datos.precio(producto.precio)}</p>`;

	return `
		<div class="col">
			<article class="card tarjeta-producto">
				<a href="${enlace}" aria-label="Ver el detalle de ${nombre}">
					${
						producto.imagen
							? `<img src="${Rutas.recurso(producto.imagen)}" alt="${nombre}" class="imagen-producto card-img-top">`
							: '<p class="sin-imagen card-img-top mb-0"></p>'
					}
				</a>
				<div class="card-body d-flex flex-column">
					<p class="etiqueta-categoria mb-1">${escapar(Datos.nombreCategoria(producto.categoria))}</p>
					<h${nivel} class="card-title h6">
						<a class="enlace-producto" href="${enlace}">${nombre}</a>
					</h${nivel}>
					${precio}
					<button
						type="button"
						class="btn btn-sm btn-outline-primary mt-auto"
						data-agregar="${escapar(producto.sku)}"
					>
						Anadir al carrito
					</button>
				</div>
			</article>
		</div>
	`;
}

/**
 * Dibuja una rejilla de productos en el contenedor indicado.
 * Con el arreglo vacio muestra un aviso en lugar de un area en blanco
 * (RF-03 CA3).
 */
function renderizarRejilla(contenedor, productos, mensajeVacio, nivel = 3) {
	if (!productos.length) {
		contenedor.className = "";
		contenedor.innerHTML = `<div class="estado-vacio"><p class="mb-0">${mensajeVacio}</p></div>`;
		return;
	}

	contenedor.className = "row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3";
	contenedor.innerHTML = productos.map((producto) => tarjetaDeProducto(producto, nivel)).join("");
}

/* --------------------------------------------------- Vista de inicio */
function renderizarDestacados() {
	const contenedor = document.getElementById("productos-destacados");
	if (!contenedor) return;

	const destacados = ["CPU-R7-7800X3D", "GPU-RTX4070S", "MB-X670-ELITE", "RAM-DDR5-32-6000", "SSD-NVME-1TB", "PER-MONITOR-27"]
		.map((sku) => Datos.producto(sku))
		.filter(Boolean);

	// Si los datos cambian y los SKU destacados ya no existen, se muestran los primeros.
	const productos = destacados.length ? destacados : Datos.productos().slice(0, 6);

	renderizarRejilla(contenedor, productos, "No hay productos disponibles por ahora.");
}

/* ------------------------------------------------ Vista de listado completo */
function renderizarListado() {
	const contenedor = document.getElementById("listado-productos");
	if (!contenedor) return;

	const codigo = new URLSearchParams(window.location.search).get("categoria") ?? "";
	const categoria = codigo ? Datos.categoria(codigo) : null;
	const productos = categoria ? Datos.productosDe(categoria.codigo) : Datos.productos();

	const titulo = document.getElementById("titulo-listado");
	if (titulo) titulo.textContent = categoria ? categoria.nombre : "Todos los productos";

	const resumen = document.getElementById("resumen-listado");
	if (resumen) {
		resumen.textContent = categoria
			? `${productos.length} productos en ${categoria.nombre}.`
			: `${productos.length} productos en el catalogo.`;
	}

	renderizarRejilla(
		contenedor,
		productos,
		categoria
			? `No hay productos disponibles en ${escapar(categoria.nombre)}.`
			: "No hay productos disponibles por ahora.",
		2,
	);
}

/* ------------------------------------------------------- Detalle de producto */
function renderizarDetalle() {
	const contenedor = document.getElementById("detalle-producto");
	if (!contenedor) return;

	const sku = new URLSearchParams(window.location.search).get("sku") ?? "";
	const producto = sku ? Datos.producto(sku) : null;

	// Un codigo que no existe avisa, en vez de dejar la vista vacia (RF-04 CA3).
	if (!producto) {
		document.title = "Producto no encontrado — Ensambla.me";
		contenedor.innerHTML = `
			<h1 class="h3 mb-3">Producto no encontrado</h1>
			<div class="estado-vacio">
				<p>No existe un producto con el codigo <strong>${escapar(sku) || "(sin codigo)"}</strong> en el catalogo.</p>
				<a class="btn btn-primary" href="${Rutas.a("productos/")}">Volver al catalogo</a>
			</div>
		`;
		return;
	}

	document.title = `${producto.nombre} — Ensambla.me`;

	// El video solo se incluye si el producto lo define; si no, no queda
	// ningun contenedor vacio en la vista (RF-04 CA4).
	const video = producto.video
		? `
			<section class="mt-4">
				<h2 class="h5">Video del producto</h2>
				<video class="video-producto" controls preload="metadata" src="${Rutas.recurso(producto.video)}">
					Tu navegador no puede reproducir este video.
				</video>
			</section>
		`
		: "";

	const alerta =
		producto.stockCritico !== "" && producto.stock <= Number(producto.stockCritico)
			? '<p class="alerta-stock mb-0">Ultimas unidades disponibles</p>'
			: "";

	contenedor.innerHTML = `
		<nav aria-label="Ubicacion" class="mb-3">
			<ol class="breadcrumb small mb-0">
				<li class="breadcrumb-item"><a href="${Rutas.a("productos/")}">Productos</a></li>
				<li class="breadcrumb-item">
					<a href="${Rutas.a(`productos/?categoria=${encodeURIComponent(producto.categoria)}`)}">
						${escapar(Datos.nombreCategoria(producto.categoria))}
					</a>
				</li>
				<li class="breadcrumb-item active" aria-current="page">${escapar(producto.sku)}</li>
			</ol>
		</nav>

		<div class="row g-4">
			<div class="col-12 col-lg-6">
				${
					producto.imagen
						? `<img src="${Rutas.recurso(producto.imagen)}" alt="${escapar(producto.nombre)}" class="imagen-detalle">`
						: '<p class="sin-imagen imagen-detalle mb-0"></p>'
				}
			</div>

			<div class="col-12 col-lg-6">
				<p class="etiqueta-categoria mb-1">${escapar(Datos.nombreCategoria(producto.categoria))}</p>
				<h1 class="h3">${escapar(producto.nombre)}</h1>
				<p class="precio">${producto.precio === 0 ? "Gratis" : Datos.precio(producto.precio)}</p>
				<p>${escapar(producto.descripcion) || "Este producto todavia no tiene descripcion."}</p>

				<dl class="ficha-tecnica row small">
					<dt class="col-5">Codigo (SKU)</dt>
					<dd class="col-7">${escapar(producto.sku)}</dd>
					<dt class="col-5">Categoria</dt>
					<dd class="col-7">${escapar(Datos.nombreCategoria(producto.categoria))}</dd>
					<dt class="col-5">Stock</dt>
					<dd class="col-7">${producto.stock} unidades</dd>
				</dl>

				${alerta}

				<div class="d-flex flex-wrap gap-2 mt-3">
					<button type="button" class="btn btn-primary" data-agregar="${escapar(producto.sku)}">
						Anadir al carrito
					</button>
					<a class="btn btn-outline-primary" href="${Rutas.a("carrito/")}">Ir al carrito</a>
				</div>
			</div>
		</div>

		${video}
	`;
}

document.addEventListener("includes:loaded", () => {
	renderizarCategorias();
	renderizarDestacados();
	renderizarListado();
	renderizarDetalle();
});

window.Catalogo = {
	renderizarCategorias,
	renderizarDestacados,
	renderizarListado,
	renderizarDetalle,
	tarjetaDeProducto,
};
