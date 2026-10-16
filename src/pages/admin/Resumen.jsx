import { Link } from "react-router";
import { categorias, ordenes, productos, roles, totalOrden, usuarios } from "../../data/datos.js";
import { useTitulo } from "../../hooks/useTitulo.js";
import { enStockCritico } from "../../logic/stock.js";
import { precio } from "../../utils/formato.js";

const ACCESOS = [
	{
		titulo: "Mantenedor de Productos",
		texto: "Listar, crear y editar los productos del catalogo, con alerta de bajo inventario.",
		ruta: "/admin/productos",
		boton: "Abrir productos",
	},
	{
		titulo: "Mantenedor de Usuarios",
		texto: "Listar, crear y editar usuarios, y asignarles su tipo de usuario.",
		ruta: "/admin/usuarios",
		boton: "Abrir usuarios",
	},
	{
		titulo: "Ordenes",
		texto: "Consultar las ordenes simuladas y su detalle en modo de solo lectura.",
		ruta: "/admin/ordenes",
		boton: "Abrir ordenes",
	},
];

/** Indicador del resumen: titulo, cifra y nota. */
function Indicador({ titulo, valor, nota }) {
	return (
		<div className="col">
			<article className="tarjeta-indicador h-100 p-3">
				<p className="etiqueta-categoria mb-1">{titulo}</p>
				<p className="cifra mb-1">{valor}</p>
				<p className="small text-secondary mb-0">{nota}</p>
			</article>
		</div>
	);
}

/** Home del panel: estado de los datos y accesos a los mantenedores (RNF-08 CA5). */
export default function Resumen() {
	useTitulo("Panel — Ensambla.me");
	const lista = productos();
	const vendido = ordenes.reduce((total, orden) => total + totalOrden(orden.numero), 0);

	const indicadores = [
		{ titulo: "Productos en catalogo", valor: lista.length, nota: `${categorias.length} categorias` },
		{ titulo: "En stock critico", valor: lista.filter(enStockCritico).length, nota: "Requieren reposicion" },
		{ titulo: "Usuarios registrados", valor: usuarios().length, nota: `${roles.length} roles` },
		{ titulo: "Ordenes simuladas", valor: ordenes.length, nota: `${precio(vendido)} en total` },
	];

	return (
		<main className="col-12 col-lg-9">
			<p className="sobretitulo">Administracion</p>
			<h1 className="h3">Resumen del sistema</h1>
			<p className="text-secondary mb-4">
				Estado de los datos cargados en esta sesion del navegador. Los mantenedores estan en el menu de la
				izquierda.
			</p>

			<div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
				{indicadores.map((indicador) => (
					<Indicador key={indicador.titulo} {...indicador} />
				))}
			</div>

			<div className="row row-cols-1 row-cols-md-3 g-3">
				{ACCESOS.map((acceso) => (
					<div className="col" key={acceso.ruta}>
						<article className="card h-100">
							<div className="card-body d-flex flex-column">
								<h2 className="h6 card-title">{acceso.titulo}</h2>
								<p className="card-text small">{acceso.texto}</p>
								<Link className="btn btn-sm btn-outline-primary mt-auto align-self-start" to={acceso.ruta}>
									{acceso.boton}
								</Link>
							</div>
						</article>
					</div>
				))}
			</div>
		</main>
	);
}
