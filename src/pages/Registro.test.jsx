import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usuarios } from "../data/datos.js";
import { limpiarAlmacenamiento, renderConProviders } from "../testUtils.jsx";
import Registro from "./Registro.jsx";

describe("Registro", () => {
	beforeEach(limpiarAlmacenamiento);

	it("muestra el formulario con sus campos obligatorios", () => {
		renderConProviders(<Registro />);

		expect(screen.getByRole("heading", { level: 1, name: "Registro de cliente" })).toBeInTheDocument();
		["RUN", "Nombre", "Apellidos", "Correo", "Contrasena", "Direccion"].forEach((etiqueta) =>
			expect(screen.getByLabelText(new RegExp(`^${etiqueta}`))).toBeRequired(),
		);
		expect(screen.getByLabelText(/^Fecha de nacimiento/)).not.toBeRequired();
	});

	it("enviar vacio muestra un error por cada campo obligatorio y no crea el usuario", async () => {
		renderConProviders(<Registro />);
		const antes = usuarios().length;

		await userEvent.click(screen.getByRole("button", { name: "Crear mi cuenta" }));

		expect(screen.getAllByText("Este campo es obligatorio.").length).toBeGreaterThanOrEqual(5);
		expect(usuarios()).toHaveLength(antes);
	});

	it("un RUN con el digito verificador incorrecto muestra el error al escribir", async () => {
		renderConProviders(<Registro />);

		await userEvent.type(screen.getByLabelText(/^RUN/), "123456784");

		expect(screen.getByText(/^RUN invalido/)).toBeInTheDocument();
		expect(screen.getByLabelText(/^RUN/)).toHaveClass("is-invalid");
	});

	it("un RUN correcto queda marcado como valido", async () => {
		renderConProviders(<Registro />);

		await userEvent.type(screen.getByLabelText(/^RUN/), "123456785");

		expect(screen.getByLabelText(/^RUN/)).toHaveClass("is-valid");
	});

	it("rechaza un correo de un dominio no permitido", async () => {
		renderConProviders(<Registro />);

		await userEvent.type(screen.getByLabelText(/^Correo/), "ana@hotmail.com");

		expect(screen.getByText(/Solo se aceptan los dominios/)).toBeInTheDocument();
	});

	it("rechaza una contrasena fuera de 4 a 10 caracteres", async () => {
		renderConProviders(<Registro />);

		await userEvent.type(screen.getByLabelText(/^Contrasena/), "abc");

		expect(screen.getByText("La contrasena debe tener entre 4 y 10 caracteres.")).toBeInTheDocument();
	});
});
