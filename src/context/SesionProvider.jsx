import { useCallback, useMemo, useState } from "react";
import { usuarios } from "../data/datos.js";
import { CLAVE_SESION, SesionContext, leerSesion } from "./sesion.js";

export default function SesionProvider({ children }) {
	const [sesion, setSesion] = useState(leerSesion);

	const iniciar = useCallback((correo, contrasena) => {
		const usuario = usuarios().find(
			(u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase() && u.contrasena === contrasena,
		);
		if (!usuario) return { ok: false, mensaje: "Correo o contrasena incorrectos." };

		const nueva = {
			run: usuario.run,
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			correo: usuario.correo,
			rol: usuario.tipoUsuario,
		};
		try {
			window.sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
		} catch (error) {
			console.error("sesion: no se pudo guardar la sesion", error);
		}
		setSesion(nueva);
		return { ok: true, sesion: nueva };
	}, []);

	const cerrar = useCallback(() => {
		try {
			window.sessionStorage.removeItem(CLAVE_SESION);
		} catch (error) {
			console.error("sesion: no se pudo limpiar la sesion", error);
		}
		setSesion(null);
	}, []);

	const actualizar = useCallback(
		({ nombre, apellidos, correo }) => {
			if (!sesion) return;
			const nueva = { ...sesion, nombre, apellidos, correo };
			try {
				window.sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
			} catch (error) {
				console.error("sesion: no se pudo guardar la sesion", error);
			}
			setSesion(nueva);
		},
		[sesion],
	);

	const valor = useMemo(() => ({ sesion, iniciar, cerrar, actualizar }), [sesion, iniciar, cerrar, actualizar]);
	return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
