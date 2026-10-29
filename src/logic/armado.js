import { admisibles as admisiblesDelCatalogo, productosDe as productosDelCatalogo } from "../data/datos.js";

export const estadoInicial = (total) => ({
	total,
	modo: null,
	indice: 0,
	elecciones: [],
	agregado: false,
});

export function armadoReducer(estado, accion) {
	const avanzar = (elecciones) => ({ ...estado, elecciones, indice: Math.min(estado.indice + 1, estado.total) });

	switch (accion.tipo) {
		case "modo":
			return { ...estadoInicial(estado.total), modo: accion.modo };
		case "registrar": {
			const elecciones = estado.elecciones.slice(0, estado.indice);
			elecciones[estado.indice] = { categoria: accion.categoria, sku: accion.sku };
			return avanzar(elecciones);
		}
		case "omitir": {
			const elecciones = [...estado.elecciones];
			elecciones[estado.indice] = { categoria: accion.categoria, sku: null };
			return avanzar(elecciones);
		}
		case "volver":
			return { ...estado, indice: Math.max(0, estado.indice - 1) };
		case "finalizar":
			return { ...estado, indice: estado.total };
		case "seguir":
			return { ...estado, indice: estado.elecciones.length };
		case "agregado":
			return { ...estado, agregado: true };
		case "reiniciar":
			return estadoInicial(estado.total);
		default:
			return estado;
	}
}

export const elegidos = (estado) => estado.elecciones.filter((eleccion) => eleccion?.sku);

export const recorridoCompleto = (estado) => estado.indice >= estado.total;

export const puedeAgregar = (estado) =>
	!estado.agregado && elegidos(estado).length > 0 && (estado.modo === "modulos" || recorridoCompleto(estado));

export function opcionesDe(
	estado,
	categorias,
	indice = estado.indice,
	productosDe = productosDelCatalogo,
	admisibles = admisiblesDelCatalogo,
) {
	const productos = productosDe(categorias[indice].codigo);
	const anterior = indice > 0 ? estado.elecciones[indice - 1] : null;
	if (!anterior?.sku) return productos;

	const permitidos = admisibles(anterior.sku);
	return productos.filter((producto) => permitidos.includes(producto.sku));
}
