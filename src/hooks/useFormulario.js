import { useCallback, useState } from "react";
import { validar, validarValor } from "../utils/validaciones.js";

export function useFormulario(inicial, definicion) {
	const [valores, setValores] = useState(inicial);
	const [errores, setErrores] = useState({});

	const validarCampo = useCallback(
		(nombre, valor) => setErrores((actuales) => ({ ...actuales, [nombre]: validarValor(valor, definicion[nombre]) })),
		[definicion],
	);

	const asignar = useCallback((cambios) => setValores((actuales) => ({ ...actuales, ...cambios })), []);

	const registrar = (nombre) => ({
		name: nombre,
		value: valores[nombre] ?? "",
		onChange: (evento) => {
			const valor = evento.target.value;
			setValores((actuales) => ({ ...actuales, [nombre]: valor }));
			if (nombre in definicion) validarCampo(nombre, valor);
		},
		onBlur: (evento) => {
			if (nombre in definicion) validarCampo(nombre, evento.target.value);
		},
	});

	const estado = (nombre) => {
		if (!(nombre in errores)) return "";
		if (errores[nombre]) return "is-invalid";
		return String(valores[nombre] ?? "").trim() !== "" ? "is-valid" : "";
	};

	const enviar = (alEnviar) => (evento) => {
		evento.preventDefault();
		const formulario = evento.currentTarget;
		const todos = validar(valores, definicion);
		setErrores(todos);

		const primero = Object.keys(definicion).find((nombre) => todos[nombre]);
		if (primero) {
			formulario.elements.namedItem(primero)?.focus();
			return;
		}

		const datos = Object.fromEntries(
			Object.entries(valores).map(([clave, valor]) => [clave, typeof valor === "string" ? valor.trim() : valor]),
		);
		alEnviar(datos);
	};

	const reiniciar = useCallback((nuevos = inicial) => {
		setValores(nuevos);
		setErrores({});
	}, [inicial]);

	return { valores, errores, registrar, estado, enviar, asignar, reiniciar };
}
