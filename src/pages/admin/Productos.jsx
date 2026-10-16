import { Link, useSearchParams } from "react-router";
import Alerta from "../../components/Alerta.jsx";
import EstadoVacio from "../../components/EstadoVacio.jsx";
import { useSesion } from "../../context/sesion.js";
import { nombreCategoria, productos } from "../../data/datos.js";
import { useTitulo } from "../../hooks/useTitulo.js";
import { enStockCritico } from "../../logic/stock.js";
import { precioOGratis } from "../../utils/formato.js";
import { recurso } from "../../utils/recursos.js";

/** Fila del listado; la columna de acciones existe solo si se puede editar. */
function FilaProducto({ producto, puedeEditar }) {
	const critico = enStockCritico(producto);
	const sku = encodeURIComponent(producto.sku);

	return (
		<tr className={critico ? "fila-stock-critico" : undefined}>
			<td>{producto.imagen && <img src={recurso(producto.imagen)} alt="" className="miniatura" loading="lazy" />}</td>
			<td>
				<code>{producto.sku}</code>
			</td>
			<td>
				<Link className="enlace-producto" to={`/productos/${sku}`}>
					{producto.nombre}
				</Link>
			</td>
			<td>{nombreCategoria(producto.categoria)}</td>
			<td className="text-end">{precioOGratis(producto.precio)}</td>
			<td className="text-end">{producto.stock}</td>
			<td className="text-end">{producto.stockCritico === "" ? "—" : producto.stockCritico}</td>
			<td>{critico && <span className="alerta-stock">Stock critico</span>}</td>
			{puedeEditar && (
				<td className="text-end">
					<Link className="btn btn-sm btn-outline-primary" to={`/admin/productos/${sku}/editar`}>
						Editar
					</Link>
				</td>
			)}
		</tr>
	);
}

/**
 * Listado de productos (RF-10 CA1 y CA4). El rol Administrador logistico lo ve
 * en solo lectura, sin crear ni editar (RF-12 CA1).
 */
export default function Productos() {
	useTitulo("Productos — Panel Ensambla.me");
	const { sesion } = useSesion();
	const [parametros] = useSearchParams();
	const puedeEditar = sesion?.rol === "ADMIN";
	const lista = productos();
	const guardado = parametros.get("guardado");

	return (
		<main className="col-12 col-lg-9">
			<div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
				<div>
					<p className="sobretitulo">Mantenedor</p>
					<h1 className="h3 mb-0">Productos</h1>
					<p className="solo-lectura mb-0">
						{lista.length} productos en el catalogo.{puedeEditar ? "" : " Vista de solo lectura."}
					</p>
				</div>
				{puedeEditar && (
					<Link className="btn btn-primary" to="/admin/productos/nuevo">
						Nuevo producto
					</Link>
				)}
			</div>

			<div aria-live="polite">
				{guardado && (
					<Alerta>
						El producto <strong>{guardado}</strong> se guardo correctamente.
					</Alerta>
				)}
			</div>

			<div className="table-responsive">
				{lista.length ? (
					<table className="table table-hover tabla-admin align-middle">
						<caption className="visually-hidden">Listado de productos del catalogo</caption>
						<thead>
							<tr>
								<th scope="col">Imagen</th>
								<th scope="col">Codigo</th>
								<th scope="col">Nombre</th>
								<th scope="col">Categoria</th>
								<th scope="col" className="text-end">Precio</th>
								<th scope="col" className="text-end">Stock</th>
								<th scope="col" className="text-end">Critico</th>
								<th scope="col">Alerta</th>
								{puedeEditar && <th scope="col" className="text-end">Acciones</th>}
							</tr>
						</thead>
						<tbody>
							{lista.map((producto) => (
								<FilaProducto key={producto.sku} producto={producto} puedeEditar={puedeEditar} />
							))}
						</tbody>
					</table>
				) : (
					<EstadoVacio>
						<p className="mb-0">No hay productos cargados.</p>
					</EstadoVacio>
				)}
			</div>
		</main>
	);
}
