/*
 * Cargador de secciones (partials).
 *
 * Busca todos los elementos con el atributo [data-include] y reemplaza su
 * contenido con el HTML del archivo indicado. Asi index.html solo contiene la
 * estructura y cada seccion (header, nav, aside, body, footer) vive en su
 * propio archivo.
 *
 * IMPORTANTE: fetch() no funciona abriendo el archivo con doble clic (file://).
 * Hay que servir el proyecto por HTTP, por ejemplo:
 *   python3 -m http.server 8000
 * y abrir http://localhost:8000/src/pages/index.html
 */
document.addEventListener("DOMContentLoaded", () => {
	const nodos = document.querySelectorAll("[data-include]");

	const cargas = [...nodos].map(async (el) => {
		const url = el.getAttribute("data-include");
		try {
			const respuesta = await fetch(url);
			if (!respuesta.ok) {
				throw new Error(`${respuesta.status} ${respuesta.statusText}`);
			}
			el.innerHTML = await respuesta.text();
		} catch (error) {
			el.innerHTML = `<!-- No se pudo cargar "${url}": ${error.message} -->`;
			console.error(`includes.js: no se pudo cargar "${url}"`, error);
		}
	});

	Promise.all(cargas).then(() => {
		// Aviso para scripts posteriores (contador del carrito, productos, etc).
		document.dispatchEvent(new CustomEvent("includes:loaded"));
	});
});
