import { createContext, useContext } from "react";

export const CLAVE_SESION = "sesion";

export const SesionContext = createContext(null);

export function leerSesion() {
	try {
		const guardado = window.sessionStorage.getItem(CLAVE_SESION);
		if (!guardado) return null;
		const sesion = JSON.parse(guardado);
		return sesion?.run && sesion?.rol ? sesion : null;
	} catch (error) {
		console.error("sesion: datos de sesion invalidos, se considera sin sesion", error);
		return null;
	}
}

export function inicioDeRol(rol) {
	if (rol === "ADMIN") return "/admin";
	if (rol === "LOGISTICA") return "/admin/productos";
	return "/";
}

export const destinoSeguro = (pedido) => (pedido?.startsWith("/") && !pedido.startsWith("//") ? pedido : null);

export function useSesion() {
	const contexto = useContext(SesionContext);
	if (!contexto) throw new Error("useSesion debe usarse dentro de <SesionProvider>");
	return contexto;
}
