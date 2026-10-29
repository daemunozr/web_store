export const enStockCritico = (producto) =>
	producto.stockCritico !== "" &&
	producto.stockCritico !== null &&
	producto.stockCritico !== undefined &&
	Number(producto.stock) <= Number(producto.stockCritico);

export const faltante = (producto) => Number(producto.stockCritico) - Number(producto.stock);

export const productosCriticos = (productos) =>
	productos
		.filter(enStockCritico)
		.sort(
			(a, b) =>
				Number(Number(a.stock) > 0) - Number(Number(b.stock) > 0) ||
				faltante(b) - faltante(a) ||
				a.sku.localeCompare(b.sku),
		);
