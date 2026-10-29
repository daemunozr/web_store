import { render, screen } from "@testing-library/react";
import Campo from "./Campo.jsx";

describe("Campo", () => {
	it("muestra el error y la sugerencia solo cuando vienen", () => {
		const { rerender, container } = render(<Campo id="a" etiqueta="A" />);
		expect(container.querySelector(".invalid-feedback")).not.toBeInTheDocument();
		expect(container.querySelector(".form-text")).not.toBeInTheDocument();

		rerender(<Campo id="a" etiqueta="A" error="Falta el valor." sugerencia="Ejemplo: 123" />);
		expect(screen.getByText("Falta el valor.")).toHaveClass("invalid-feedback");
		expect(screen.getByText("Ejemplo: 123")).toHaveClass("form-text");
	});
});
