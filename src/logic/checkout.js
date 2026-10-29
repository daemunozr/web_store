import { precioVigente } from "./precios.js";

export const OPCIONES_ENTREGA = [
	{ codigo: "DOMICILIO", nombre: "Despacho a domicilio", costo: 4990, gratisDesde: 200000 },
	{ codigo: "RETIRO", nombre: "Retiro en tienda", costo: 0, gratisDesde: null },
];

export const entregaDe = (codigo) => OPCIONES_ENTREGA.find((opcion) => opcion.codigo === codigo);

export function costoEnvio(codigo, subtotal) {
	const opcion = entregaDe(codigo);
	if (!opcion) return 0;
	if (opcion.gratisDesde !== null && subtotal >= opcion.gratisDesde) return 0;
	return opcion.costo;
}

export function consolidar(lineas, buscar) {
	const items = new Map();
	lineas.forEach((linea) => {
		const cantidad = Math.max(0, Math.trunc(Number(linea.cantidad)) || 0);
		const existente = items.get(linea.producto);
		if (existente) existente.cantidad += cantidad;
		else items.set(linea.producto, { producto: linea.producto, cantidad, precioUnitario: precioVigente(buscar(linea.producto)) });
	});
	return [...items.values()];
}

export function faltantes(items, buscar) {
	return items.flatMap(({ producto: sku, cantidad }) => {
		const producto = buscar(sku);
		if (!producto) return [`${sku} (ya no esta en el catalogo)`];
		const stock = Number(producto.stock) || 0;
		if (stock <= 0) return [`${producto.nombre} (sin stock)`];
		return stock < cantidad ? [`${producto.nombre} (quedan ${stock})`] : [];
	});
}
