package cl.duoc.ensamblame.dto.response;

import java.math.BigDecimal;

/** Producto tal como la ve el cliente de la API: trae el codigo y el nombre de su categoria. */
public record ProductoResponse(
        String sku,
        String nombre,
        String descripcion,
        BigDecimal precio,
        Integer descuento,
        Integer stock,
        Integer stockCritico,
        String imagen,
        String video,
        String categoria,
        String nombreCategoria) {
}
