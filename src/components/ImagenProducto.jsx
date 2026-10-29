import { recurso } from "../utils/recursos.js";

export default function ImagenProducto({ producto, className, alt = producto.nombre, lazy = false }) {
	if (!producto.imagen) return <p className={`sin-imagen ${className} mb-0`}></p>;
	return (
		<img src={recurso(producto.imagen)} alt={alt} className={className} loading={lazy ? "lazy" : undefined} />
	);
}
