import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import CajaBusqueda from "./CajaBusqueda.jsx";

// Caja con su estado, como la usan los listados del panel.
function ConEstado() {
	const [valor, setValor] = useState("");
	return <CajaBusqueda id="buscar" valor={valor} onCambio={setValor} mostrados={2} total={10} />;
}

describe("CajaBusqueda", () => {
	it("con estado, el texto escrito se conserva y actualiza el conteo", async () => {
		render(<ConEstado />);

		await userEvent.type(screen.getByLabelText("Buscar"), "ram");

		expect(screen.getByLabelText("Buscar")).toHaveValue("ram");
		expect(screen.getByText("Mostrando 2 de 10.")).toBeInTheDocument();
	});
});
