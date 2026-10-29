import { screen } from "@testing-library/react";
import { producto } from "../data/datos.js";
import { limpiarAlmacenamiento, renderConProviders } from "../testUtils.jsx";
import TarjetaProducto from "./TarjetaProducto.jsx";

describe("TarjetaProducto", () => {
	beforeEach(limpiarAlmacenamiento);

	it("muestra el nombre, la categoria y el precio del producto", () => {
		const ryzen = producto("CPU-R5-7600");
		renderConProviders(<TarjetaProducto producto={ryzen} />);

		expect(screen.getByRole("link", { name: ryzen.nombre })).toBeInTheDocument();
		expect(screen.getByText("Procesadores (CPU)")).toBeInTheDocument();
		expect(screen.getByRole("article")).toHaveTextContent("$212.492");
	});
});
