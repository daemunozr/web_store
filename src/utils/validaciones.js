/*
 * Reglas de validacion de formularios (RF-01, RF-08, RF-10, RF-11, RNF-02).
 *
 * Cada regla recibe el valor del campo y devuelve "" si pasa o el mensaje de
 * error. La sugerencia del formato esperado se muestra aparte, como form-text,
 * y es distinta del mensaje de error (RNF-02 CA5).
 */

// Unicos dominios de correo aceptados por el sistema.
export const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/* ------------------------------------------------------------------- RUN */
/** Digito verificador de un RUN chileno por el metodo del modulo 11. */
export function digitoVerificador(cuerpo) {
	let suma = 0;
	let factor = 2;

	for (const caracter of [...String(cuerpo)].reverse()) {
		suma += Number(caracter) * factor;
		factor = factor === 7 ? 2 : factor + 1;
	}

	const resto = 11 - (suma % 11);
	if (resto === 11) return "0";
	if (resto === 10) return "K";
	return String(resto);
}

/** Valida un RUN sin puntos ni guion, de 7 a 9 caracteres (RF-01 CA2). */
export function runValido(valor) {
	const run = String(valor).trim().toUpperCase();
	if (!/^[0-9]{6,8}[0-9K]$/.test(run)) return false;
	return digitoVerificador(run.slice(0, -1)) === run.slice(-1);
}

/* ---------------------------------------------------------------- Reglas */
export const reglas = {
	requerido: (mensaje = "Este campo es obligatorio.") => (valor) =>
		String(valor ?? "").trim() === "" ? mensaje : "",

	maximo: (largo) => (valor) =>
		String(valor ?? "").length > largo ? `No puede superar los ${largo} caracteres.` : "",

	minimo: (largo) => (valor) => {
		const texto = String(valor ?? "").trim();
		return texto !== "" && texto.length < largo ? `Debe tener al menos ${largo} caracteres.` : "";
	},

	run: () => (valor) =>
		String(valor ?? "").trim() === "" || runValido(valor)
			? ""
			: "RUN invalido: escribelo sin puntos ni guion y revisa el digito verificador.",

	correo: () => (valor) => {
		const correo = String(valor ?? "").trim().toLowerCase();
		if (correo === "") return "";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return "Escribe un correo valido.";
		return DOMINIOS_PERMITIDOS.some((dominio) => correo.endsWith(dominio))
			? ""
			: `Solo se aceptan los dominios ${DOMINIOS_PERMITIDOS.join(", ")}.`;
	},

	contrasena: () => (valor) => {
		const clave = String(valor ?? "");
		if (clave === "") return "";
		return clave.length < 4 || clave.length > 10 ? "La contrasena debe tener entre 4 y 10 caracteres." : "";
	},

	numeroMinimo: (minimo) => (valor) => {
		if (String(valor ?? "").trim() === "") return "";
		const numero = Number(valor);
		if (Number.isNaN(numero)) return "Debe ser un numero.";
		return numero < minimo ? `No puede ser menor que ${minimo}.` : "";
	},

	entero: () => (valor) => {
		if (String(valor ?? "").trim() === "") return "";
		const numero = Number(valor);
		if (Number.isNaN(numero)) return "Debe ser un numero.";
		return Number.isInteger(numero) ? "" : "Debe ser un numero entero, sin decimales.";
	},

	seleccion: (mensaje = "Selecciona una opcion.") => (valor) => (String(valor ?? "") === "" ? mensaje : ""),
};

/** Primer error de la lista de reglas para un valor, o "" si las pasa todas. */
export const validarValor = (valor, listaDeReglas = []) =>
	listaDeReglas.map((regla) => regla(valor)).find(Boolean) ?? "";

/** Errores de todos los campos definidos: { campo: mensaje | "" }. */
export const validar = (valores, definicion) =>
	Object.fromEntries(
		Object.entries(definicion).map(([campo, listaDeReglas]) => [campo, validarValor(valores[campo], listaDeReglas)]),
	);

/**
 * Sugerencias de correo con los dominios permitidos, completando lo que el
 * usuario ya escribio antes de la arroba (RF-01 CA8).
 */
export function sugerenciasDeCorreo(escrito) {
	const local = String(escrito ?? "").trim().toLowerCase().split("@")[0];
	return DOMINIOS_PERMITIDOS.map((dominio) => `${local || "tucorreo"}${dominio}`);
}
