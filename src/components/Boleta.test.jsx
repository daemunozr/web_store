import { render, screen } from "@testing-library/react";
import { itemsDeOrden, orden, subtotalOrden, totalOrden } from "../data/datos.js";
import { desgloseIva } from "../logic/ordenes.js";
import { precio } from "../utils/formato.js";
import { limpiarAlmacenamiento } from "../testUtils.jsx";
import Boleta from "./Boleta.jsx";

describe("Boleta", () => {
	beforeEach(limpiarAlmacenamiento);

	it("el total incluye el envio y desglosa el neto y el IVA del 19 %", () => {
		render(<Boleta orden={orden("ORD-2026-0005")} items={itemsDeOrden("ORD-2026-0005")} />);
		const total = totalOrden("ORD-2026-0005");
		const { neto, iva } = desgloseIva(total);

		expect(subtotalOrden("ORD-2026-0005")).toBeLessThan(total);
		expect(screen.getByText(precio(4990))).toBeInTheDocument();
		expect(screen.getAllByText(precio(total)).length).toBeGreaterThan(0);
		expect(screen.getByText(`El total incluye IVA: neto ${precio(neto)} + IVA (19%) ${precio(iva)}.`)).toBeInTheDocument();
	});
});
