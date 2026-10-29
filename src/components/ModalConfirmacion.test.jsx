import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalConfirmacion from "./ModalConfirmacion.jsx";

describe("ModalConfirmacion", () => {
	it("confirmar llama a onConfirmar y no a onCancelar", async () => {
		const onConfirmar = vi.fn();
		const onCancelar = vi.fn();
		render(
			<ModalConfirmacion abierto titulo="Eliminar producto" onConfirmar={onConfirmar} onCancelar={onCancelar}>
				<p>Esta accion no se puede deshacer.</p>
			</ModalConfirmacion>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

		expect(onConfirmar).toHaveBeenCalledTimes(1);
		expect(onCancelar).not.toHaveBeenCalled();
	});
});
