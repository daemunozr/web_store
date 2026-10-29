import { enOferta, porcentajeDescuento, precioVigente } from "../logic/precios.js";
import { precio, precioOGratis } from "../utils/formato.js";

export default function PrecioProducto({ producto, mostrarGratis = true }) {
	const vigente = precioVigente(producto);
	const texto = mostrarGratis ? precioOGratis(vigente) : precio(vigente);
	if (!enOferta(producto)) return texto;

	return (
		<>
			{texto}
			<del className="precio-anterior">
				<span className="visually-hidden">Precio normal </span>
				{precio(producto.precio)}
			</del>
			<span className="insignia-oferta">
				-{porcentajeDescuento(producto)}%<span className="visually-hidden"> de descuento</span>
			</span>
		</>
	);
}
