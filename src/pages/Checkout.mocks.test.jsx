/*
 * Checkout con la pasarela de pago y la creacion de la orden reemplazadas por
 * mocks de modulo (vi.mock). Aisla la pagina de ambas dependencias para
 * comprobar el contrato con ellas: que llama a la pasarela con el monto y la
 * tarjeta, y como reacciona a lo que respondan. Con los modulos reales, ver
 * Checkout.test.jsx.
 */
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router";
import { guardarCarrito } from "../context/carrito.js";
import { crearOrden } from "../data/datos.js";
import { autorizarPago } from "../logic/pago.js";
import { limpiarAlmacenamiento, renderConProviders } from "../testUtils.jsx";
import Checkout from "./Checkout.jsx";

// Cada mock conserva la implementacion real por defecto y solo se pisa por prueba.
vi.mock("../logic/pago.js", async (importOriginal) => {
	const original = await importOriginal();
	return { ...original, autorizarPago: vi.fn(original.autorizarPago) };
});

vi.mock("../data/datos.js", async (importOriginal) => {
	const original = await importOriginal();
	return { ...original, crearOrden: vi.fn(original.crearOrden) };
});

const CAMILA = { run: "123456785", nombre: "Camila", apellidos: "Soto Vera", correo: "camila@gmail.com", rol: "CLIENTE" };

function Destino() {
	const { pathname, state } = useLocation();
	return (
		<div>
			<p data-testid="destino">{pathname}</p>
			<p data-testid="motivo">{state?.motivo}</p>
		</div>
	);
}

function montar() {
	return renderConProviders(
		<Routes>
			<Route path="/checkout" element={<Checkout />} />
			<Route path="/pago/*" element={<Destino />} />
		</Routes>,
		{ ruta: "/checkout", sesion: CAMILA },
	);
}

async function pagarCon(tarjeta) {
	await userEvent.type(screen.getByLabelText(/^Numero de la tarjeta/), tarjeta);
	await userEvent.type(screen.getByLabelText(/^Vencimiento/), "1299");
	await userEvent.type(screen.getByLabelText(/^Codigo de seguridad/), "123");
}

const carrito = (...lineas) => guardarCarrito(lineas.map(([producto, cantidad], i) => ({ linea: i + 1, producto, cantidad, armado: null })));

describe("Checkout con la pasarela y la orden mockeadas", () => {
	beforeEach(() => {
		limpiarAlmacenamiento();
		vi.clearAllMocks();
	});

	describe("pago con tarjeta", () => {
		beforeEach(() => carrito(["PER-MOUSE-RGB", 1]));

		it("cobra a la pasarela el total con envio y la tarjeta escrita", async () => {
			autorizarPago.mockReturnValueOnce({ aprobado: true });
			montar();

			await pagarCon("4242424242424242");
			await userEvent.click(screen.getByRole("button", { name: "Pagar $29.980" }));

			expect(autorizarPago).toHaveBeenCalledOnce();
			expect(autorizarPago).toHaveBeenCalledWith({ numero: "4242 4242 4242 4242", monto: 29980 });
			expect(screen.getByTestId("destino")).toHaveTextContent(/^\/pago\/correcto\/ORD-/);
		});

		it("la aprobacion de la pasarela manda, aunque la tarjeta real seria rechazada", async () => {
			autorizarPago.mockReturnValueOnce({ aprobado: true });
			montar();

			await pagarCon("4000000000000002");
			await userEvent.click(screen.getByRole("button", { name: /^Pagar/ }));

			expect(screen.getByTestId("destino")).toHaveTextContent(/^\/pago\/correcto\//);
			expect(crearOrden).toHaveBeenCalledWith(expect.objectContaining({ medioPago: "Tarjeta terminada en 0002" }));
		});

		it("un rechazo lleva a la pagina de error con el motivo y no crea la orden", async () => {
			autorizarPago.mockReturnValueOnce({ aprobado: false, motivo: "Motivo simulado" });
			montar();

			await pagarCon("4242424242424242");
			await userEvent.click(screen.getByRole("button", { name: /^Pagar/ }));

			expect(screen.getByTestId("destino")).toHaveTextContent("/pago/error");
			expect(screen.getByTestId("motivo")).toHaveTextContent("Motivo simulado");
			expect(crearOrden).not.toHaveBeenCalled();
		});

		it("cobra antes de crear la orden", async () => {
			montar();

			await pagarCon("4242424242424242");
			await userEvent.click(screen.getByRole("button", { name: /^Pagar/ }));

			expect(autorizarPago.mock.invocationCallOrder[0]).toBeLessThan(crearOrden.mock.invocationCallOrder[0]);
		});

		it("si la orden no se puede crear avisa, no navega y deja el carrito", async () => {
			crearOrden.mockReturnValueOnce({ ok: false, mensaje: "No se pudo crear la orden" });
			montar();

			await pagarCon("4242424242424242");
			await userEvent.click(screen.getByRole("button", { name: /^Pagar/ }));

			expect(screen.getByRole("alert")).toHaveTextContent("No se pudo crear la orden");
			expect(screen.queryByTestId("destino")).not.toBeInTheDocument();
			expect(JSON.parse(window.localStorage.getItem("carrito"))).toHaveLength(1);
		});
	});

	it("un pedido sin costo crea la orden sin llamar a la pasarela", async () => {
		carrito(["PER-MOUSEPAD", 1]);
		montar();

		await userEvent.click(screen.getByLabelText(/Retiro en tienda/));
		await userEvent.click(screen.getByRole("button", { name: "Confirmar pedido" }));

		expect(autorizarPago).not.toHaveBeenCalled();
		expect(crearOrden).toHaveBeenCalledWith(expect.objectContaining({ medioPago: "Sin pago", entrega: "RETIRO" }));
		expect(screen.getByTestId("destino")).toHaveTextContent(/^\/pago\/correcto\//);
	});
});
