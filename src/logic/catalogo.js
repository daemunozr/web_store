import { nombreCategoria } from "../data/datos.js";
import { coincide } from "./busqueda.js";
import { enOferta, porcentajeDescuento, precioVigente } from "./precios.js";

export const ORDENES = [
	{ valor: "", texto: "Orden del catalogo" },
	{ valor: "precio-asc", texto: "Precio: menor a mayor" },
	{ valor: "precio-desc", texto: "Precio: mayor a menor" },
	{ valor: "nombre", texto: "Nombre (A-Z)" },
	{ valor: "descuento", texto: "Mayor descuento" },
];

export function leerCriterios(parametros, ordenInicial = "") {
	const numero = (clave) => {
		const texto = (parametros.get(clave) ?? "").trim();
		if (texto === "") return null;
		const valor = Number(texto);
		return Number.isFinite(valor) && valor >= 0 ? valor : null;
	};
	const pedido = parametros.get("orden");

	return {
		q: (parametros.get("q") ?? "").trim(),
		categoria: parametros.get("categoria") ?? "",
		min: numero("min"),
		max: numero("max"),
		oferta: parametros.get("oferta") === "1",
		stock: parametros.get("stock") === "1",
		orden: ORDENES.some((orden) => orden.valor === pedido) ? pedido : ordenInicial,
	};
}

export function aParametros(valores) {
	const parametros = new URLSearchParams();
	Object.entries(valores).forEach(([clave, valor]) => {
		if (valor === true) parametros.set(clave, "1");
		else if (valor !== false && valor != null && String(valor).trim() !== "") parametros.set(clave, String(valor).trim());
	});
	return parametros;
}

export const hayFiltros = (criterios) =>
	Boolean(criterios.q || criterios.categoria || criterios.oferta || criterios.stock) ||
	criterios.min !== null ||
	criterios.max !== null;

export function filtrar(productos, criterios, nombreDeCategoria = nombreCategoria) {
	return productos.filter((producto) => {
		if (criterios.categoria && producto.categoria !== criterios.categoria) return false;
		if (criterios.oferta && !enOferta(producto)) return false;
		if (criterios.stock && Number(producto.stock) <= 0) return false;

		const precio = precioVigente(producto);
		if (criterios.min !== null && precio < criterios.min) return false;
		if (criterios.max !== null && precio > criterios.max) return false;

		return coincide(
			criterios.q,
			producto.nombre,
			producto.sku,
			producto.descripcion,
			nombreDeCategoria(producto.categoria),
		);
	});
}

export function ordenar(productos, orden) {
	const copia = [...productos];
	switch (orden) {
		case "precio-asc":
			return copia.sort((a, b) => precioVigente(a) - precioVigente(b));
		case "precio-desc":
			return copia.sort((a, b) => precioVigente(b) - precioVigente(a));
		case "nombre":
			return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
		case "descuento":
			return copia.sort((a, b) => porcentajeDescuento(b) - porcentajeDescuento(a));
		default:
			return copia;
	}
}
