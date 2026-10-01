/*
 * Blogs: listado y detalle de articulos (RF-09).
 *
 * Los articulos viven en los datos (scripts/datos.js), de modo que el listado y
 * el detalle se generan solos y agregar un articulo no obliga a tocar el HTML.
 */

function renderizarListadoBlogs() {
	const contenedor = document.getElementById("listado-blogs");
	if (!contenedor) return;

	if (!Datos.blogs.length) {
		contenedor.className = "";
		contenedor.innerHTML = '<div class="estado-vacio"><p class="mb-0">Todavia no hay articulos publicados.</p></div>';
		return;
	}

	contenedor.className = "row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4";
	contenedor.innerHTML = Datos.blogs
		.map((articulo) => {
			const enlace = Rutas.a(`blog/?slug=${encodeURIComponent(articulo.slug)}`);
			return `
				<div class="col">
					<article class="card tarjeta-blog h-100">
						<a href="${enlace}" aria-label="Leer ${escapar(articulo.titulo)}">
							<img src="${Rutas.recurso(articulo.imagen)}" alt="" class="imagen-blog card-img-top">
						</a>
						<div class="card-body d-flex flex-column">
							<p class="etiqueta-categoria mb-1">${Datos.fecha(articulo.fecha)} &middot; ${escapar(articulo.autor)}</p>
							<h2 class="h6 card-title">
								<a class="enlace-producto" href="${enlace}">${escapar(articulo.titulo)}</a>
							</h2>
							<p class="card-text small">${escapar(articulo.resumen)}</p>
							<a class="btn btn-sm btn-outline-primary mt-auto align-self-start" href="${enlace}">
								Leer el articulo
							</a>
						</div>
					</article>
				</div>
			`;
		})
		.join("");
}

function renderizarArticulo() {
	const contenedor = document.getElementById("articulo-blog");
	if (!contenedor) return;

	const slug = new URLSearchParams(window.location.search).get("slug") ?? "";
	const articulo = slug ? Datos.blog(slug) : null;

	if (!articulo) {
		document.title = "Articulo no encontrado — Ensambla.me";
		contenedor.innerHTML = `
			<h1 class="h3">Articulo no encontrado</h1>
			<div class="estado-vacio">
				<p>No existe un articulo con el identificador <strong>${escapar(slug) || "(sin identificador)"}</strong>.</p>
				<a class="btn btn-primary" href="${Rutas.a("blogs/")}">Volver a los blogs</a>
			</div>
		`;
		return;
	}

	document.title = `${articulo.titulo} — Ensambla.me`;

	contenedor.innerHTML = `
		<p class="etiqueta-categoria mb-1">${Datos.fecha(articulo.fecha)} &middot; ${escapar(articulo.autor)}</p>
		<h1 class="h3 mb-3">${escapar(articulo.titulo)}</h1>
		<img src="${Rutas.recurso(articulo.imagen)}" alt="" class="imagen-articulo mb-4">
		<p class="lead">${escapar(articulo.resumen)}</p>
		${articulo.cuerpo.map((parrafo) => `<p>${escapar(parrafo)}</p>`).join("")}
		<p class="mt-4"><a class="btn btn-outline-primary" href="${Rutas.a("blogs/")}">Volver a los blogs</a></p>
	`;
}

document.addEventListener("includes:loaded", () => {
	renderizarListadoBlogs();
	renderizarArticulo();
});

window.Blogs = { renderizarListadoBlogs, renderizarArticulo };
