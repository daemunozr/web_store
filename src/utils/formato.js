/** Precio en pesos chilenos; los decimales solo se muestran si existen (RF-03 CA2). */
export function precio(valor) {
	const numero = Number(valor) || 0;
	const decimales = Number.isInteger(numero) ? 0 : 2;
	return new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		minimumFractionDigits: decimales,
		maximumFractionDigits: decimales,
	}).format(numero);
}

/** "Gratis" para precio 0, si no el precio formateado (RF-10). */
export const precioOGratis = (valor) => (Number(valor) === 0 ? "Gratis" : precio(valor));

/** Fecha ISO (AAAA-MM-DD) como DD-MM-AAAA. */
export function fecha(iso) {
	if (!iso) return "";
	const [ano, mes, dia] = iso.split("-");
	return `${dia}-${mes}-${ano}`;
}

/** "1 unidad" o "N unidades". */
export const unidades = (n) => `${n} ${n === 1 ? "unidad" : "unidades"}`;
