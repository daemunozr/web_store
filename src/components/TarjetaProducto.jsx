import { Link } from "react-router";
import BotonAgregar from "./BotonAgregar.jsx";
import ImagenProducto from "./ImagenProducto.jsx";
import { nombreCategoria } from "../data/datos.js";
import { precio } from "../utils/formato.js";

/** Tarjeta de un producto del catalogo: imagen, nombre, precio y boton (RF-03). */
export default function TarjetaProducto({ producto, nivel = 3 }) {
	const enlace = `/productos/${encodeURIComponent(producto.sku)}`;
	const Titulo = `h${nivel}`;

	return (
		<div className="col">
			<article className="card tarjeta-producto">
				<Link to={enlace} aria-label={`Ver el detalle de ${producto.nombre}`}>
					<ImagenProducto producto={producto} className="imagen-producto card-img-top" lazy />
				</Link>
				<div className="card-body d-flex flex-column">
					<p className="etiqueta-categoria mb-1">{nombreCategoria(producto.categoria)}</p>
					<Titulo className="card-title h6">
						<Link className="enlace-producto" to={enlace}>
							{producto.nombre}
						</Link>
					</Titulo>
					{producto.precio === 0 ? (
						<p className="precio precio-gratis mb-3">Gratis</p>
					) : (
						<p className="precio mb-3">{precio(producto.precio)}</p>
					)}
					<BotonAgregar producto={producto} className="btn btn-sm btn-outline-primary mt-auto" />
				</div>
			</article>
		</div>
	);
}
