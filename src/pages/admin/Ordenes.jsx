import { Fragment } from "react";
import { Link } from "react-router";
import EstadoVacio from "../../components/EstadoVacio.jsx";
import { itemsDeOrden, nombreCliente, ordenes, producto, totalOrden } from "../../data/datos.js";
import { useTitulo } from "../../hooks/useTitulo.js";
import { fecha, precio } from "../../utils/formato.js";

/** Listado de ordenes en solo lectura: cliente, fecha, productos y total (RF-12 CA2). */
export default function Ordenes() {
	useTitulo("Ordenes — Panel Ensambla.me");

	return (
		<main className="col-12 col-lg-9">
			<p className="sobretitulo">Consulta</p>
			<h1 className="h3">Ordenes</h1>
			<p className="solo-lectura mb-3">
				Vista de solo lectura. La creacion de ordenes a partir del carrito queda para una entrega posterior.
			</p>

			<div className="table-responsive">
				{ordenes.length ? (
					<table className="table table-hover tabla-admin align-middle">
						<caption className="visually-hidden">Listado de ordenes de compra</caption>
						<thead>
							<tr>
								<th scope="col">Orden</th>
								<th scope="col">Cliente</th>
								<th scope="col">Fecha</th>
								<th scope="col">Productos</th>
								<th scope="col" className="text-end">Total</th>
								<th scope="col" className="text-end">Detalle</th>
							</tr>
						</thead>
						<tbody>
							{ordenes.map((orden) => (
								<tr key={orden.numero}>
									<td>
										<code>{orden.numero}</code>
									</td>
									<td>
										{nombreCliente(orden.cliente)}
										<br />
										<span className="small text-secondary">{orden.cliente}</span>
									</td>
									<td>{fecha(orden.fecha)}</td>
									<td className="small">
										{itemsDeOrden(orden.numero).map((item, i) => (
											<Fragment key={item.producto}>
												{i > 0 && <br />}
												{producto(item.producto)?.nombre ?? item.producto} (x{item.cantidad})
											</Fragment>
										))}
									</td>
									<td className="text-end">{precio(totalOrden(orden.numero))}</td>
									<td className="text-end">
										<Link
											className="btn btn-sm btn-outline-primary"
											to={`/admin/ordenes/${encodeURIComponent(orden.numero)}`}
										>
											Ver detalle
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<EstadoVacio>
						<p className="mb-0">No hay ordenes registradas.</p>
					</EstadoVacio>
				)}
			</div>
		</main>
	);
}
