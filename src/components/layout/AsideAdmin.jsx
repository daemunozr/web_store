import { Link, NavLink } from "react-router";
import { useSesion } from "../../context/sesion.js";

const OPCIONES_PANEL = [
	{ texto: "Resumen", ruta: "/admin", roles: ["ADMIN"] },
	{ texto: "Productos", ruta: "/admin/productos", roles: ["ADMIN", "LOGISTICA"] },
	{ texto: "Usuarios", ruta: "/admin/usuarios", roles: ["ADMIN"] },
	{ texto: "Ordenes", ruta: "/admin/ordenes", roles: ["ADMIN", "LOGISTICA"] },
];

/**
 * Menu vertical del panel. Solo se renderizan las opciones del rol: las demas
 * no existen en el DOM, no basta con ocultarlas (RNF-02 CA2).
 */
export default function AsideAdmin() {
	const { sesion } = useSesion();
	const opciones = OPCIONES_PANEL.filter((opcion) => sesion && opcion.roles.includes(sesion.rol));

	return (
		<aside className="col-12 col-lg-3">
			<p className="sobretitulo mb-2">Panel</p>
			<nav className="menu-admin nav flex-column" aria-label="Menu del panel de administracion">
				{opciones.map((opcion) => (
					<NavLink
						key={opcion.ruta}
						to={opcion.ruta}
						end={opcion.ruta === "/admin"}
						className={({ isActive }) => `nav-link${isActive ? " activo" : ""}`}
					>
						{opcion.texto}
					</NavLink>
				))}
			</nav>
			<p className="small mt-3 mb-0">
				<Link to="/">Volver a la tienda</Link>
			</p>
		</aside>
	);
}
