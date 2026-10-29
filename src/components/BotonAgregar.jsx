import { useCarrito } from "../context/carrito.js";

export default function BotonAgregar({ producto, className, texto = "Anadir al carrito" }) {
	const { agregar } = useCarrito();

	if (Number(producto.stock) <= 0) {
		return (
			<button type="button" className={className} disabled>
				Sin stock
			</button>
		);
	}

	return (
		<button type="button" className={className} onClick={() => agregar(producto.sku)}>
			{texto}
		</button>
	);
}
