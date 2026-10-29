export const esExterna = (ruta) => /^([a-z]+:|\/\/|#)/i.test(ruta);

export function recurso(ruta) {
	if (!ruta) return "";
	if (esExterna(ruta) || ruta.startsWith("/")) return ruta;
	return `${import.meta.env.BASE_URL}${ruta}`;
}
