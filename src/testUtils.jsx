import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import CarritoProvider from "./context/CarritoProvider.jsx";
import DatosProvider from "./context/DatosProvider.jsx";
import SesionProvider from "./context/SesionProvider.jsx";

export const SESION_ADMIN = { run: "11111111K", nombre: "Admin", apellidos: "Prueba", correo: "admin@duoc.cl", rol: "ADMIN" };
export const SESION_CLIENTE = { run: "22222222K", nombre: "Cliente", apellidos: "Prueba", correo: "cliente@gmail.com", rol: "CLIENTE" };
export const SESION_LOGISTICA = { run: "33333333K", nombre: "Bodega", apellidos: "Prueba", correo: "bodega@duoc.cl", rol: "LOGISTICA" };

export const sesionDe = ({ run, nombre, apellidos, correo, tipoUsuario }) => ({ run, nombre, apellidos, correo, rol: tipoUsuario });

export function limpiarAlmacenamiento() {
	window.sessionStorage.clear();
	window.localStorage.clear();
}

export function renderConProviders(interfaz, { ruta = "/", sesion = null } = {}) {
	if (sesion) window.sessionStorage.setItem("sesion", JSON.stringify(sesion));

	return render(
		<MemoryRouter initialEntries={[ruta]}>
			<DatosProvider>
				<SesionProvider>
					<CarritoProvider>{interfaz}</CarritoProvider>
				</SesionProvider>
			</DatosProvider>
		</MemoryRouter>,
	);
}
