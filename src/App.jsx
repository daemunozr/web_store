import { Route, Routes } from "react-router";
import RutaProtegida from "./components/RutaProtegida.jsx";
import { LayoutAdmin, LayoutTienda } from "./components/layout/Layouts.jsx";
import CarritoProvider from "./context/CarritoProvider.jsx";
import SesionProvider from "./context/SesionProvider.jsx";
import Armado from "./pages/Armado.jsx";
import Blog from "./pages/Blog.jsx";
import Blogs from "./pages/Blogs.jsx";
import Carrito from "./pages/Carrito.jsx";
import Contacto from "./pages/Contacto.jsx";
import Creditos from "./pages/Creditos.jsx";
import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Producto from "./pages/Producto.jsx";
import Productos from "./pages/Productos.jsx";
import Registro from "./pages/Registro.jsx";
import FormularioProducto from "./pages/admin/FormularioProducto.jsx";
import FormularioUsuario from "./pages/admin/FormularioUsuario.jsx";
import Orden from "./pages/admin/Orden.jsx";
import Ordenes from "./pages/admin/Ordenes.jsx";
import ProductosAdmin from "./pages/admin/Productos.jsx";
import Resumen from "./pages/admin/Resumen.jsx";
import Usuarios from "./pages/admin/Usuarios.jsx";

const SOLO_ADMIN = ["ADMIN"];
const ADMIN_Y_LOGISTICA = ["ADMIN", "LOGISTICA"];

/** Envuelve una vista del panel con su control de acceso por rol (RNF-02). */
const protegida = (roles, vista) => <RutaProtegida roles={roles}>{vista}</RutaProtegida>;

export default function App() {
	return (
		<SesionProvider>
			<CarritoProvider>
				<Routes>
					{/* Vistas de tienda con la barra lateral de categorias (RNF-08 CA3). */}
					<Route element={<LayoutTienda conAside />}>
						<Route index element={<Inicio />} />
						<Route path="productos" element={<Productos />} />
						<Route path="productos/:sku" element={<Producto />} />
						<Route path="armado" element={<Armado />} />
						<Route path="carrito" element={<Carrito />} />
					</Route>

					<Route element={<LayoutTienda />}>
						<Route path="blogs" element={<Blogs />} />
						<Route path="blogs/:slug" element={<Blog />} />
						<Route path="nosotros" element={<Nosotros />} />
						<Route path="contacto" element={<Contacto />} />
						<Route path="registro" element={<Registro />} />
						<Route path="login" element={<Login />} />
						<Route path="creditos" element={<Creditos />} />
						<Route path="*" element={<NoEncontrada />} />
					</Route>

					<Route path="admin" element={<LayoutAdmin />}>
						<Route index element={protegida(SOLO_ADMIN, <Resumen />)} />
						<Route path="productos" element={protegida(ADMIN_Y_LOGISTICA, <ProductosAdmin />)} />
						<Route path="productos/nuevo" element={protegida(SOLO_ADMIN, <FormularioProducto />)} />
						<Route path="productos/:sku/editar" element={protegida(SOLO_ADMIN, <FormularioProducto />)} />
						<Route path="usuarios" element={protegida(SOLO_ADMIN, <Usuarios />)} />
						<Route path="usuarios/nuevo" element={protegida(SOLO_ADMIN, <FormularioUsuario />)} />
						<Route path="usuarios/:run/editar" element={protegida(SOLO_ADMIN, <FormularioUsuario />)} />
						<Route path="ordenes" element={protegida(ADMIN_Y_LOGISTICA, <Ordenes />)} />
						<Route path="ordenes/:numero" element={protegida(ADMIN_Y_LOGISTICA, <Orden />)} />
					</Route>
				</Routes>
			</CarritoProvider>
		</SesionProvider>
	);
}
