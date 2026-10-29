import { Outlet } from "react-router";
import Aside from "./Aside.jsx";
import AsideAdmin from "./AsideAdmin.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Nav from "./Nav.jsx";

export function LayoutTienda({ conAside = false }) {
	return (
		<>
			<Header />
			<Nav />
			<div className="container my-4">
				{conAside ? (
					<div className="row g-4">
						<Aside />
						<Outlet />
					</div>
				) : (
					<Outlet />
				)}
			</div>
			<Footer />
		</>
	);
}

export function LayoutAdmin() {
	return (
		<>
			<Header />
			<div className="container my-4">
				<div className="row g-4">
					<AsideAdmin />
					<Outlet />
				</div>
			</div>
			<Footer />
		</>
	);
}
