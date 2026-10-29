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

export const precioOGratis = (valor) => (Number(valor) === 0 ? "Gratis" : precio(valor));

export function fecha(iso) {
	if (!iso) return "";
	const [ano, mes, dia] = iso.split("-");
	return `${dia}-${mes}-${ano}`;
}

export function fechaLocal(ahora = new Date()) {
	const dos = (n) => String(n).padStart(2, "0");
	return `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`;
}

export function mesLegible(mes) {
	const [ano, numero] = String(mes).split("-").map(Number);
	if (!ano || !numero) return String(mes);
	return new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(new Date(ano, numero - 1, 1));
}

export const unidades = (n) => `${n} ${n === 1 ? "unidad" : "unidades"}`;
