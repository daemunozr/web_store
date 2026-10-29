export const normalizarTexto = (valor) =>
	String(valor ?? "")
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim();

export function coincide(busqueda, ...campos) {
	const palabras = normalizarTexto(busqueda).split(/\s+/).filter(Boolean);
	if (!palabras.length) return true;

	const texto = normalizarTexto(campos.join(" "));
	return palabras.every((palabra) => texto.includes(palabra));
}
