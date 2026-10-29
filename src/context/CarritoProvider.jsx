import { useCallback, useMemo, useRef, useState } from "react";
import Toasts from "../components/Toasts.jsx";
import * as reglas from "../logic/carrito.js";
import { CarritoContext, guardarCarrito, leerCarrito } from "./carrito.js";
import { useDatos } from "./datos.js";

export default function CarritoProvider({ children }) {
	const [guardadas, setLineas] = useState(leerCarrito);
	const { productos } = useDatos();

	const lineas = useMemo(
		() => reglas.normalizar(guardadas, (sku) => productos.find((p) => p.sku === sku)),
		[guardadas, productos],
	);
	const [avisos, setAvisos] = useState([]);
	const siguienteAviso = useRef(1);

	const avisar = useCallback((texto) => {
		if (!texto) return;
		const id = siguienteAviso.current++;
		setAvisos((actuales) => [...actuales, { id, texto }]);
		window.setTimeout(() => setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id)), 3000);
	}, []);

	const cerrarAviso = useCallback((id) => setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id)), []);

	const aplicar = useCallback(
		(operacion) => {
			const resultado = operacion(leerCarrito());
			const nuevas = resultado.lineas ?? resultado;
			if (resultado.ok !== false) guardarCarrito(nuevas);
			setLineas(resultado.ok === false ? leerCarrito() : nuevas);
			avisar(resultado.mensaje);
			return resultado.ok !== false;
		},
		[avisar],
	);

	const valor = useMemo(
		() => ({
			lineas,
			cantidad: reglas.cantidadItems(lineas),
			total: reglas.total(lineas),
			agregar: (sku, cantidad = 1) => aplicar((actuales) => reglas.agregarProducto(actuales, sku, cantidad)),
			agregarArmado: (skus) =>
				aplicar((actuales) =>
					reglas.agregarArmado(actuales, skus, `ARM-${Date.now().toString(36).toUpperCase()}`),
				),
			cambiarCantidad: (numero, cantidad) =>
				aplicar((actuales) => reglas.cambiarCantidad(actuales, numero, cantidad)),
			eliminarLinea: (numero) => aplicar((actuales) => reglas.eliminarLinea(actuales, numero)),
			eliminarArmado: (agrupador) => aplicar((actuales) => reglas.eliminarArmado(actuales, agrupador)),
			vaciar: () => aplicar(() => reglas.vaciar()),
		}),
		[lineas, aplicar],
	);

	return (
		<CarritoContext.Provider value={valor}>
			{children}
			<Toasts avisos={avisos} onCerrar={cerrarAviso} />
		</CarritoContext.Provider>
	);
}
