import { render, screen } from "@testing-library/react";
import Alerta from "./Alerta.jsx";

describe("Alerta", () => {
	it("usa el tipo recibido en la clase de Bootstrap", () => {
		render(<Alerta tipo="danger">Fallo</Alerta>);

		expect(screen.getByRole("alert")).toHaveClass("alert-danger");
	});
});
