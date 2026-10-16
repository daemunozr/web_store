import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useCarrito } from "../../context/carrito.js";
import { recurso } from "../../utils/recursos.js";

const ENLACES = [
	{ ruta: "/", texto: "Inicio" },
	{ ruta: "/productos", texto: "Productos" },
	{ ruta: "/armado", texto: "Armar mi PC" },
	{ ruta: "/blogs", texto: "Blogs" },
	{ ruta: "/nosotros", texto: "Nosotros" },
	{ ruta: "/contacto", texto: "Contacto" },
];

/** Menu principal: logo, vistas publicas y acceso al carrito con su contador (RF-14). */
export default function Nav() {
	const { cantidad } = useCarrito();
	const [abierto, setAbierto] = useState(false);
	const cerrar = () => setAbierto(false);

	return (
		<nav className="navbar navbar-expand-lg navbar-principal" aria-label="Navegacion principal">
			<div className="container">
				<Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={cerrar}>
					<img src={recurso("resources/img/logo.svg")} alt="" className="logo-marca" width="36" height="36" />
					Ensambla<span className="punto">.me</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					aria-controls="menuPrincipal"
					aria-expanded={abierto}
					aria-label="Abrir el menu de navegacion"
					onClick={() => setAbierto((valor) => !valor)}
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className={`collapse navbar-collapse${abierto ? " show" : ""}`} id="menuPrincipal">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						{ENLACES.map((enlace) => (
							<li className="nav-item" key={enlace.ruta}>
								<NavLink className="nav-link" to={enlace.ruta} end={enlace.ruta === "/"} onClick={cerrar}>
									{enlace.texto}
								</NavLink>
							</li>
						))}
					</ul>

					<Link to="/carrito" className="btn btn-outline-primary position-relative boton-carrito" onClick={cerrar}>
						Carrito
						<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
							{cantidad}
							<span className="visually-hidden"> productos en el carrito</span>
						</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
