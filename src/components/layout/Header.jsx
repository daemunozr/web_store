import { startTransition } from "react";
import { Link, useNavigate } from "react-router";
import { inicioDeRol, useSesion } from "../../context/sesion.js";
import { nombreRol } from "../../data/datos.js";

export default function Header() {
	const { sesion, cerrar } = useSesion();
	const navegar = useNavigate();

	const cerrarSesion = () => {
		navegar("/");
		startTransition(cerrar);
	};

	return (
		<header className="barra-utilidad py-1">
			<div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
				<p className="datos-contacto mb-0">
					<span className="me-3">Mesa de ayuda +56 2 2345 6789</span>
					<span>contacto@ensambla.me</span>
				</p>
				<nav className="d-flex flex-wrap align-items-center column-gap-3 row-gap-1" aria-label="Acciones de sesion">
					{sesion ? (
						<>
							<span>
								Hola, {sesion.nombre} ({nombreRol(sesion.rol)})
							</span>
							<Link to="/perfil">Mi perfil</Link>
							<Link to="/mis-compras">Mis compras</Link>
							{sesion.rol !== "CLIENTE" && <Link to={inicioDeRol(sesion.rol)}>Panel de administracion</Link>}
							<button type="button" className="btn btn-sm btn-outline-light" onClick={cerrarSesion}>
								Cerrar sesion
							</button>
						</>
					) : (
						<>
							<Link to="/login">Iniciar sesion</Link>
							<Link to="/registro">Registrarse</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
