import { createContext, useContext } from "react";

export const DatosContext = createContext(null);

export function useDatos() {
	const contexto = useContext(DatosContext);
	if (!contexto) throw new Error("useDatos debe usarse dentro de <DatosProvider>");
	return contexto;
}
