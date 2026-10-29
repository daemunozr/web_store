import { useCallback, useMemo, useState } from "react";
import * as datos from "../data/datos.js";
import { DatosContext } from "./datos.js";

export default function DatosProvider({ children }) {
	const [version, setVersion] = useState(0);

	const conAviso = useCallback(
		(operacion) =>
			(...argumentos) => {
				const resultado = operacion(...argumentos);
				if (resultado.ok) setVersion((actual) => actual + 1);
				return resultado;
			},
		[],
	);

	const valor = useMemo(
		() => ({
			version,
			productos: datos.productos(),
			usuarios: datos.usuarios(),
			categorias: datos.categorias(),
			ordenes: datos.ordenes(),
			itemsOrden: datos.itemsOrden(),
			crearProducto: conAviso(datos.crearProducto),
			actualizarProducto: conAviso(datos.actualizarProducto),
			eliminarProducto: conAviso(datos.eliminarProducto),
			crearUsuario: conAviso(datos.crearUsuario),
			actualizarUsuario: conAviso(datos.actualizarUsuario),
			eliminarUsuario: conAviso(datos.eliminarUsuario),
			crearCategoria: conAviso(datos.crearCategoria),
			actualizarCategoria: conAviso(datos.actualizarCategoria),
			eliminarCategoria: conAviso(datos.eliminarCategoria),
			crearOrden: conAviso(datos.crearOrden),
		}),
		[version, conAviso],
	);

	return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}
