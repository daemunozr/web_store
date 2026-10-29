import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FiltrosCatalogo from "./FiltrosCatalogo.jsx";

const VACIOS = { q: "", categoria: "", min: null, max: null, oferta: false, stock: false, orden: "" };
const CATEGORIAS = [
	{ codigo: "cpu", nombre: "Procesadores" },
	{ codigo: "ram", nombre: "Memoria RAM" },
];

describe("FiltrosCatalogo", () => {
	it("escribir no aplica el filtro hasta enviar el formulario", async () => {
		const aplicar = vi.fn();
		render(<FiltrosCatalogo criterios={VACIOS} aplicar={aplicar} categorias={CATEGORIAS} />);

		await userEvent.type(screen.getByLabelText("Buscar"), "ryzen");
		expect(aplicar).not.toHaveBeenCalled();

		await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));
		expect(aplicar).toHaveBeenCalledTimes(1);
		expect(aplicar).toHaveBeenCalledWith(expect.objectContaining({ q: "ryzen" }));
	});
});
