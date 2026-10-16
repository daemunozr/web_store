import { Link, useParams } from "react-router";
import EstadoVacio from "../../components/EstadoVacio.jsx";
import {
	itemsDeOrden,
	nombreCliente,
	nombreComuna,
	orden as buscarOrden,
	producto,
	totalOrden,
	usuario,
} from "../../data/datos.js";
import { useTitulo } from "../../hooks/useTitulo.js";
import { fecha, precio } from "../../utils/formato.js";

/** Detalle de una orden en solo lectura (RF-12 CA2). */
export default function Orden() {
	const { numero = "" } = useParams();
	const orden = buscarOrden(numero);
	useTitulo(orden ? `Orden ${orden.numero} — Panel Ensambla.me` : "Orden no encontrada — Panel Ensambla.me");

	const volver = (
		<Link className="btn btn-outline-primary" to="/admin/ordenes">
			Volver a las ordenes
		</Link>
	);

	if (!orden) {
		return (
			<main className="col-12 col-lg-9">
				<h1 className="h3">Orden no encontrada</h1>
				<EstadoVacio>
					<p>
						No existe una orden con el numero <strong>{numero || "(sin numero)"}</strong>.
					</p>
					<Link className="btn btn-primary" to="/admin/ordenes">
						Volver a las ordenes
					</Link>
				</EstadoVacio>
			</main>
		);
	}

	const cliente = usuario(orden.cliente);

	return (
		<main className="col-12 col-lg-9">
			<p className="sobretitulo">Consulta</p>
			<h1 className="h3">Orden {orden.numero}</h1>
			<p className="solo-lectura mb-4">Vista de solo lectura.</p>

			<dl className="row small">
				<dt className="col-4 col-md-3">Cliente</dt>
				<dd className="col-8 col-md-9">
					{nombreCliente(orden.cliente)} (RUN {orden.cliente})
				</dd>
				<dt className="col-4 col-md-3">Correo</dt>
				<dd className="col-8 col-md-9">{cliente?.correo || "—"}</dd>
				<dt className="col-4 col-md-3">Despacho</dt>
				<dd className="col-8 col-md-9">
					{cliente ? `${cliente.direccion}, ${nombreComuna(cliente.comuna)}` : "—"}
				</dd>
				<dt className="col-4 col-md-3">Fecha</dt>
				<dd className="col-8 col-md-9">{fecha(orden.fecha)}</dd>
			</dl>

			<div className="table-responsive">
				<table className="table tabla-admin">
					<caption className="visually-hidden">Detalle de los productos de la orden</caption>
					<thead>
						<tr>
							<th scope="col">Codigo</th>
							<th scope="col">Producto</th>
							<th scope="col" className="text-end">Cantidad</th>
							<th scope="col" className="text-end">Precio unitario</th>
							<th scope="col" className="text-end">Subtotal</th>
						</tr>
					</thead>
					<tbody>
						{itemsDeOrden(orden.numero).map((item) => (
							<tr key={item.producto}>
								<td>
									<code>{item.producto}</code>
								</td>
								<td>{producto(item.producto)?.nombre || "Producto fuera del catalogo"}</td>
								<td className="text-end">{item.cantidad}</td>
								<td className="text-end">{precio(item.precioUnitario)}</td>
								<td className="text-end">{precio(item.cantidad * item.precioUnitario)}</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<th scope="row" colSpan={4} className="text-end">
								Total de la orden
							</th>
							<td className="text-end precio">{precio(totalOrden(orden.numero))}</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<p>{volver}</p>
		</main>
	);
}
