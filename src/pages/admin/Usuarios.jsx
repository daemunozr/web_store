import { Link, useSearchParams } from "react-router";
import Alerta from "../../components/Alerta.jsx";
import EstadoVacio from "../../components/EstadoVacio.jsx";
import { nombreComuna, nombreRegionDeComuna, nombreRol, usuarios } from "../../data/datos.js";
import { useTitulo } from "../../hooks/useTitulo.js";

/** Listado de usuarios con acceso a crear y editar (RF-11 CA1). */
export default function Usuarios() {
	useTitulo("Usuarios — Panel Ensambla.me");
	const [parametros] = useSearchParams();
	const lista = usuarios();
	const guardado = parametros.get("guardado");

	return (
		<main className="col-12 col-lg-9">
			<div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
				<div>
					<p className="sobretitulo">Mantenedor</p>
					<h1 className="h3 mb-0">Usuarios</h1>
				</div>
				<Link className="btn btn-primary" to="/admin/usuarios/nuevo">
					Nuevo usuario
				</Link>
			</div>

			<div aria-live="polite">
				{guardado && (
					<Alerta>
						El usuario con RUN <strong>{guardado}</strong> se guardo correctamente.
					</Alerta>
				)}
			</div>

			<div className="table-responsive">
				{lista.length ? (
					<table className="table table-hover tabla-admin align-middle">
						<caption className="visually-hidden">Listado de usuarios del sistema</caption>
						<thead>
							<tr>
								<th scope="col">RUN</th>
								<th scope="col">Nombre</th>
								<th scope="col">Correo</th>
								<th scope="col">Tipo de usuario</th>
								<th scope="col">Comuna</th>
								<th scope="col" className="text-end">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{lista.map((usuario) => (
								<tr key={usuario.run}>
									<td>
										<code>{usuario.run}</code>
									</td>
									<td>
										{usuario.nombre} {usuario.apellidos}
									</td>
									<td>{usuario.correo}</td>
									<td>{nombreRol(usuario.tipoUsuario)}</td>
									<td>
										{nombreComuna(usuario.comuna)}, {nombreRegionDeComuna(usuario.comuna)}
									</td>
									<td className="text-end">
										<Link
											className="btn btn-sm btn-outline-primary"
											to={`/admin/usuarios/${encodeURIComponent(usuario.run)}/editar`}
										>
											Editar
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<EstadoVacio>
						<p className="mb-0">No hay usuarios cargados.</p>
					</EstadoVacio>
				)}
			</div>
		</main>
	);
}
