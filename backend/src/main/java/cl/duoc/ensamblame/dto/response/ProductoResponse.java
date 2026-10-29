package cl.duoc.ensamblame.dto.response;

import java.math.BigDecimal;

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
