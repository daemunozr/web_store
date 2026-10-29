export const TASA_IVA = 0.19;

export const subtotalItems = (items) => items.reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0);

export function desgloseIva(total) {
	const neto = Math.round(total / (1 + TASA_IVA));
	return { neto, iva: total - neto };
}

export function siguienteNumero(ordenes, fecha) {
	const ano = String(fecha).slice(0, 4);
	const formato = new RegExp(`^ORD-${ano}-(\\d+)$`);
	const ultimo = ordenes.reduce((mayor, orden) => {
		const coincidencia = formato.exec(orden.numero);
		return coincidencia ? Math.max(mayor, Number(coincidencia[1])) : mayor;
	}, 0);
	return `ORD-${ano}-${String(ultimo + 1).padStart(4, "0")}`;
}

export function puedeVerOrden(orden, sesion) {
	if (!orden) return false;
	if (sesion && ["ADMIN", "LOGISTICA"].includes(sesion.rol)) return true;
	if (!orden.cliente) return true;
	return Boolean(sesion) && sesion.run === orden.cliente;
}

export const masRecientesPrimero = (ordenes) =>
	[...ordenes].sort(
		(a, b) => b.fecha.localeCompare(a.fecha) || b.numero.localeCompare(a.numero, undefined, { numeric: true }),
	);
