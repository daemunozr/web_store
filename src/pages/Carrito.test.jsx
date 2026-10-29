import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { guardarCarrito } from "../context/carrito.js";
import { limpiarAlmacenamiento, renderConProviders } from "../testUtils.jsx";
import Carrito from "./Carrito.jsx";

describe("Carrito", () => {
	beforeEach(() => {
		limpiarAlmacenamiento();
		guardarCarrito([{ linea: 1, producto: "PER-MOUSE-RGB", cantidad: 2, armado: null }]);
	});

	it("cambiar la cantidad actualiza el total y lo guarda", async () => {
		const { container } = renderConProviders(<Carrito />);
		const cantidad = screen.getByLabelText("Cantidad");

		await userEvent.clear(cantidad);
		await userEvent.type(cantidad, "3");
		await userEvent.tab();

		expect(cantidad).toHaveValue(3);
		expect(container.querySelector(".total")).toHaveTextContent("$74.970");
		expect(JSON.parse(window.localStorage.getItem("carrito"))[0].cantidad).toBe(3);
	});
});
