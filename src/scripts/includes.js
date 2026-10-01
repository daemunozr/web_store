/*
 * Cargador de secciones (partials) y resolucion de rutas del sitio.
 *
 * Cada seccion compartida de la pagina vive en su propio archivo, con el nombre
 * del elemento que contiene (header.html -> <header>, nav.html -> <nav>,
 * aside.html -> <aside>, body.html -> el <main> del inicio, footer.html ->
 * <footer>). La vista solo declara los contenedores:
 *
 *   <header data-include="header.html"></header>
 *   <main   data-include="body.html"></main>
 *
 * El contenedor se REEMPLAZA por los nodos del archivo, de modo que el partial
 * es literalmente su elemento con sus clases. Los href/src relativos del
 * fragmento se resuelven contra la URL del partial y no contra la de la vista,
 * para que las secciones compartidas de src/pages/ funcionen igual desde
 * productos.html que desde admin/usuarios.html.
 *
 * IMPORTANTE: fetch() no funciona abriendo el archivo con doble clic (file://).
 * Hay que servir el proyecto por HTTP, por ejemplo:
 *   python3 -m http.server 8000
 * y abrir http://localhost:8000/src/pages/index.html
 */

/* -------------------------------------------------------------------------
   Rutas: base del sitio, calculada desde la URL de la vista actual.
   Permite que los scripts armen enlaces sin saber a que profundidad estan.
   ------------------------------------------------------------------------- */
const Rutas = (() => {
	const marca = "/pages/";
	const corte = window.location.pathname.lastIndexOf(marca);
	const base = corte === -1 ? "./" : window.location.pathname.slice(0, corte + marca.length);

	const esExterna = (ruta) => /^([a-z]+:|\/\/|#)/i.test(ruta);

	return {
		// Base de las vistas: .../src/pages/
		base,
		// Enlace a una vista: Rutas.a("producto.html?sku=CPU-01")
		a: (ruta) => (esExterna(ruta) ? ruta : base + ruta),
		// Recurso guardado como ruta relativa a src/: "resources/img/cpu.svg"
		recurso: (ruta) => {
			if (!ruta) return "";
			if (esExterna(ruta)) return ruta;
			return new URL(`${base}../${ruta}`, window.location.origin).pathname;
		},
		esExterna,
	};
})();

window.Rutas = Rutas;

/**
 * Escapa un texto para insertarlo en HTML sin que se interprete como marcado.
 * Los datos pueden traer comillas (por ejemplo un monitor de 27") o caracteres
 * con significado en HTML, y cualquiera de ellos romperia el atributo o la
 * etiqueta donde se inserta.
 */
function escapar(valor) {
	return String(valor ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

window.escapar = escapar;

/* -------------------------------------------------------------------------
   Composicion de las secciones
   ------------------------------------------------------------------------- */
const ATRIBUTOS_DE_RUTA = ["href", "src", "poster", "action", "data-include"];

/** Reescribe las rutas relativas del fragmento contra la URL de su partial. */
function resolverRutas(fragmento, urlPartial) {
	const origen = new URL(urlPartial, window.location.href);

	fragmento.querySelectorAll(ATRIBUTOS_DE_RUTA.map((a) => `[${a}]`).join(",")).forEach((el) => {
		ATRIBUTOS_DE_RUTA.forEach((atributo) => {
			const valor = el.getAttribute(atributo);
			if (!valor || Rutas.esExterna(valor)) return;
			const url = new URL(valor, origen);
			el.setAttribute(atributo, url.pathname + url.search + url.hash);
		});
	});
}

/** Carga un contenedor [data-include] y lo reemplaza por el contenido del archivo. */
async function incluir(el) {
	const url = el.getAttribute("data-include");
	try {
		const respuesta = await fetch(url);
		if (!respuesta.ok) {
			throw new Error(`${respuesta.status} ${respuesta.statusText}`);
		}

		const plantilla = document.createElement("template");
		plantilla.innerHTML = await respuesta.text();
		resolverRutas(plantilla.content, url);

		const nuevos = [...plantilla.content.children];
		el.replaceWith(plantilla.content);

		// Un partial puede incluir otros (por ejemplo el menu del panel).
		await Promise.all(nuevos.map((nodo) => componer(nodo)));
	} catch (error) {
		// La seccion queda vacia pero el resto de la pagina sigue utilizable.
		el.append(document.createComment(` No se pudo cargar "${url}": ${error.message} `));
		console.error(`includes.js: no se pudo cargar "${url}"`, error);
	}
}

/** Compone todas las secciones pendientes dentro de una raiz. */
function componer(raiz) {
	const pendientes = [...raiz.querySelectorAll("[data-include]")];
	if (raiz.matches?.("[data-include]")) pendientes.unshift(raiz);
	return Promise.all(pendientes.map(incluir));
}

document.addEventListener("DOMContentLoaded", () => {
	componer(document.body).then(() => {
		// Aviso para los scripts de vista (sesion, catalogo, carrito, etc.).
		document.dispatchEvent(new CustomEvent("includes:loaded"));
	});
});
