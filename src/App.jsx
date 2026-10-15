import { Link, Route, Routes } from "react-router";

/*
 * Esqueleto de rutas de la migracion a React. Las vistas reales del sitio
 * (legacy/pages/) se incorporan en el paso 2.
 */
function Inicio() {
	return (
		<main className="container py-5">
			<h1>Ensambla.me</h1>
			<p className="lead">Tienda de componentes y asistente de armado de PC gamer.</p>
			<p className="text-secondary">Migracion a React en curso.</p>
		</main>
	);
}

function NoEncontrada() {
	return (
		<main className="container py-5">
			<h1>Pagina no encontrada</h1>
			<p>La direccion que buscas no existe.</p>
			<Link className="btn btn-primary" to="/">Volver al inicio</Link>
		</main>
	);
}

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Inicio />} />
			<Route path="*" element={<NoEncontrada />} />
		</Routes>
	);
}
