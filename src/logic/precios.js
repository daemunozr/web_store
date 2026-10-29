export const MAXIMO_DESCUENTO = 90;

export function porcentajeDescuento(producto) {
	const porcentaje = Math.trunc(Number(producto?.descuento));
	if (!Number.isFinite(porcentaje) || porcentaje <= 0) return 0;
	return Math.min(porcentaje, MAXIMO_DESCUENTO);
}

export const enOferta = (producto) => porcentajeDescuento(producto) > 0;

export function precioVigente(producto) {
	const lista = Number(producto?.precio) || 0;
	const porcentaje = porcentajeDescuento(producto);
	return porcentaje ? Math.round((lista * (100 - porcentaje)) / 100) : lista;
}
