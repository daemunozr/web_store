/** Un producto esta en stock critico cuando su stock no supera el umbral (RF-10 CA4). */
export const enStockCritico = (producto) =>
	producto.stockCritico !== "" &&
	producto.stockCritico !== null &&
	producto.stockCritico !== undefined &&
	Number(producto.stock) <= Number(producto.stockCritico);
