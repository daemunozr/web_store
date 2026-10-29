import { subtotalItems } from "./ordenes.js";

const suma = (valores) => valores.reduce((total, valor) => total + valor, 0);
const envioDe = (orden) => Number(orden.costoEnvio) || 0;

function itemsDe(ordenes, items) {
	const numeros = new Set(ordenes.map((orden) => orden.numero));
	return items.filter((item) => numeros.has(item.orden));
}

export function filtrarPorFecha(ordenes, { desde = "", hasta = "" } = {}) {
	if (desde && hasta && desde > hasta) return [];
	return ordenes.filter((orden) => (!desde || orden.fecha >= desde) && (!hasta || orden.fecha <= hasta));
}

export function resumenVentas(ordenes, items) {
	const propios = itemsDe(ordenes, items);
	const envios = suma(ordenes.map(envioDe));
	const ingresos = subtotalItems(propios) + envios;
	return {
		ordenes: ordenes.length,
		ingresos,
		envios,
		unidades: suma(propios.map((item) => item.cantidad)),
		ticketPromedio: ordenes.length ? Math.round(ingresos / ordenes.length) : 0,
	};
}

export function ventasPorMes(ordenes, items) {
	const meses = new Map();
	ordenes.forEach((orden) => {
		const mes = orden.fecha.slice(0, 7);
		const total = subtotalItems(items.filter((item) => item.orden === orden.numero)) + envioDe(orden);
		const actual = meses.get(mes) ?? { mes, ordenes: 0, ingresos: 0 };
		meses.set(mes, { mes, ordenes: actual.ordenes + 1, ingresos: actual.ingresos + total });
	});
	return [...meses.values()].sort((a, b) => a.mes.localeCompare(b.mes));
}

export function ventasPorCategoria(ordenes, items, buscar) {
	const categorias = new Map();
	itemsDe(ordenes, items).forEach((item) => {
		const categoria = buscar(item.producto)?.categoria ?? "";
		const actual = categorias.get(categoria) ?? { categoria, unidades: 0, ingresos: 0 };
		categorias.set(categoria, {
			categoria,
			unidades: actual.unidades + item.cantidad,
			ingresos: actual.ingresos + item.cantidad * item.precioUnitario,
		});
	});
	return [...categorias.values()].sort((a, b) => b.ingresos - a.ingresos || a.categoria.localeCompare(b.categoria));
}

export function topProductos(ordenes, items, buscar, n = 5) {
	const productos = new Map();
	itemsDe(ordenes, items).forEach((item) => {
		const actual = productos.get(item.producto) ?? {
			producto: item.producto,
			nombre: buscar(item.producto)?.nombre ?? "",
			unidades: 0,
			ingresos: 0,
		};
		productos.set(item.producto, {
			...actual,
			unidades: actual.unidades + item.cantidad,
			ingresos: actual.ingresos + item.cantidad * item.precioUnitario,
		});
	});
	return [...productos.values()]
		.sort((a, b) => b.unidades - a.unidades || b.ingresos - a.ingresos || a.producto.localeCompare(b.producto))
		.slice(0, n);
}

export function topClientes(ordenes, items, n = 5) {
	const clientes = new Map();
	[...ordenes]
		.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.numero.localeCompare(b.numero, undefined, { numeric: true }))
		.forEach((orden) => {
			const clave = orden.cliente || `invitado:${String(orden.correo).toLowerCase()}`;
			const total = subtotalItems(items.filter((item) => item.orden === orden.numero)) + envioDe(orden);
			const actual = clientes.get(clave) ?? { clave, cliente: orden.cliente, ordenes: 0, gasto: 0 };
			clientes.set(clave, {
				...actual,
				nombre: orden.nombre,
				correo: orden.correo,
				ordenes: actual.ordenes + 1,
				gasto: actual.gasto + total,
			});
		});
	return [...clientes.values()]
		.sort((a, b) => b.gasto - a.gasto || b.ordenes - a.ordenes || a.nombre.localeCompare(b.nombre, "es"))
		.slice(0, n);
}

export const valorInventario = (productos) => ({
	productos: productos.length,
	unidades: suma(productos.map((producto) => Number(producto.stock) || 0)),
	valor: suma(productos.map((producto) => (Number(producto.stock) || 0) * (Number(producto.precio) || 0))),
});
