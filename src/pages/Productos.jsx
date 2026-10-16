import { useSearchParams } from "react-router";
import RejillaProductos from "../components/RejillaProductos.jsx";
import { categoria as buscarCategoria, productos, productosDe } from "../data/datos.js";
import { useTitulo } from "../hooks/useTitulo.js";

/** Listado completo del catalogo o de una categoria (?categoria=) (RF-03). */
export default function Productos() {
	useTitulo("Productos — Ensambla.me");
	const [parametros] = useSearchParams();
	const codigo = parametros.get("categoria") ?? "";
	const categoria = codigo ? buscarCategoria(codigo) : null;
	const lista = categoria ? productosDe(categoria.codigo) : productos();

	return (
		<main className="col-12 col-lg-9">
			<p className="sobretitulo">Catalogo</p>
			<h1 className="h3">{categoria ? categoria.nombre : "Todos los productos"}</h1>
			<p className="text-secondary">
				{categoria
					? `${lista.length} productos en ${categoria.nombre}.`
					: `${lista.length} productos en el catalogo.`}
			</p>

			<RejillaProductos
				productos={lista}
				nivel={2}
				mensajeVacio={
					categoria
						? `No hay productos disponibles en ${categoria.nombre}.`
						: "No hay productos disponibles por ahora."
				}
			/>
		</main>
	);
}
