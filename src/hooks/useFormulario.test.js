import { act, renderHook } from "@testing-library/react";
import { reglas } from "../utils/validaciones.js";
import { useFormulario } from "./useFormulario.js";

const INICIAL = { nombre: "", correo: "" };
const DEFINICION = {
	nombre: [reglas.requerido()],
	correo: [reglas.requerido(), reglas.correo()],
};

describe("useFormulario", () => {
	it("onChange guarda el valor y valida el campo al escribir", () => {
		const { result } = renderHook(() => useFormulario(INICIAL, DEFINICION));

		act(() => result.current.registrar("correo").onChange({ target: { value: "ana@hotmail.com" } }));

		expect(result.current.valores.correo).toBe("ana@hotmail.com");
		expect(result.current.errores.correo).toMatch(/Solo se aceptan los dominios/);
		expect(result.current.estado("correo")).toBe("is-invalid");
	});
});
