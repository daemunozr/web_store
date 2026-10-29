import { producto as productoDelCatalogo } from "../data/datos.js";
import { unidades } from "../utils/formato.js";
import { precioVigente } from "./precios.js";

const numerar = (lineas) => lineas.map((linea, i) => ({ ...linea, linea: i + 1 }));

export function normalizar(lineas, buscar = productoDelCatalogo) {
	if (!Array.isArray(lineas)) throw new Error("el carrito no es un arreglo");

	const ocupadas = {};
	return numerar(
		lineas
			.filter((linea) => linea && typeof linea.producto === "string" && buscar(linea.producto))
			.map((linea) => {
				const stock = Number(buscar(linea.producto).stock) || 0;
				const libres = Math.max(0, stock - (ocupadas[linea.producto] ?? 0));
				const cantidad = Math.min(Math.max(1, Math.trunc(Number(linea.cantidad)) || 1), libres);
				ocupadas[linea.producto] = (ocupadas[linea.producto] ?? 0) + cantidad;
				return { producto: linea.producto, cantidad, armado: linea.armado || null };
			})
			.filter((linea) => linea.cantidad > 0),
	);
}

export const cantidadItems = (lineas) => lineas.reduce((total, linea) => total + linea.cantidad, 0);

export const subtotal = (linea, buscar = productoDelCatalogo) =>
	precioVigente(buscar(linea.producto)) * linea.cantidad;

export const total = (lineas, buscar = productoDelCatalogo) =>
	lineas.reduce((suma, linea) => suma + subtotal(linea, buscar), 0);

export const unidadesEnCarrito = (lineas, sku, excluirLinea = null) =>
	lineas
		.filter((linea) => linea.producto === sku && linea.linea !== excluirLinea)
		.reduce((suma, linea) => suma + linea.cantidad, 0);

export function disponible(lineas, sku, excluirLinea = null, buscar = productoDelCatalogo) {
	const stock = Number(buscar(sku)?.stock) || 0;
	return Math.max(0, stock - unidadesEnCarrito(lineas, sku, excluirLinea));
}

export function agrupar(lineas) {
	const sueltas = lineas.filter((linea) => !linea.armado);
	const armados = {};
	lineas
		.filter((linea) => linea.armado)
		.forEach((linea) => {
			(armados[linea.armado] ??= []).push(linea);
		});
	return { sueltas, armados };
}

export function agregarProducto(lineas, sku, cantidad = 1, buscar = productoDelCatalogo) {
	const producto = buscar(sku);
	if (!producto) return { ok: false, lineas, mensaje: `No existe el producto "${sku}".` };

	if (Number(producto.stock) <= 0) {
		return { ok: false, lineas, mensaje: `"${producto.nombre}" no tiene stock disponible.` };
	}

	const libres = disponible(lineas, sku, null, buscar);
	if (cantidad > libres) {
		const enCarrito = unidadesEnCarrito(lineas, sku);
		return {
			ok: false,
			lineas,
			mensaje:
				libres === 0
					? `Ya tienes en el carrito todo el stock de "${producto.nombre}" (${unidades(enCarrito)}).`
					: `Solo ${libres === 1 ? "queda" : "quedan"} ${unidades(libres)} de "${producto.nombre}" y ya tienes ${enCarrito} en el carrito.`,
		};
	}

	const existente = lineas.find((linea) => linea.producto === sku && !linea.armado);
	const nuevas = existente
		? lineas.map((linea) => (linea === existente ? { ...linea, cantidad: linea.cantidad + cantidad } : linea))
		: [...lineas, { linea: lineas.length + 1, producto: sku, cantidad, armado: null }];

	return { ok: true, lineas: numerar(nuevas), mensaje: `"${producto.nombre}" se agrego al carrito.` };
}

export function agregarArmado(lineas, skus, agrupador, buscar = productoDelCatalogo) {
	if (!skus.length) return { ok: false, lineas, mensaje: "El armado no tiene componentes." };

	const nuevas = [...lineas];
	const sinStock = [];

	skus.forEach((sku) => {
		const producto = buscar(sku);
		if (!producto) return;
		if (disponible(nuevas, sku, null, buscar) < 1) {
			sinStock.push(producto.nombre);
			return;
		}
		nuevas.push({ linea: nuevas.length + 1, producto: sku, cantidad: 1, armado: agrupador });
	});

	if (sinStock.length) {
		return { ok: false, lineas, mensaje: `Sin stock suficiente para: ${sinStock.join(", ")}. El armado no se agrego.` };
	}

	return {
		ok: true,
		lineas: numerar(nuevas),
		mensaje: `Armado agregado al carrito con ${skus.length} ${skus.length === 1 ? "componente" : "componentes"}.`,
	};
}

export function cambiarCantidad(lineas, numero, cantidad, buscar = productoDelCatalogo) {
	const linea = lineas.find((l) => l.linea === numero);
	if (!linea) return { ok: false, lineas, mensaje: "" };

	const pedida = Math.max(1, Math.trunc(Number(cantidad)) || 1);
	const tope = Math.max(1, disponible(lineas, linea.producto, numero, buscar));
	const mensaje = pedida > tope ? `Solo puedes llevar ${unidades(tope)} de "${buscar(linea.producto)?.nombre}".` : "";

	return {
		ok: true,
		lineas: lineas.map((l) => (l === linea ? { ...l, cantidad: Math.min(pedida, tope) } : l)),
		mensaje,
	};
}

export const eliminarLinea = (lineas, numero) => numerar(lineas.filter((linea) => linea.linea !== numero));

export const vaciar = () => [];

export const eliminarArmado = (lineas, agrupador) => numerar(lineas.filter((linea) => linea.armado !== agrupador));
