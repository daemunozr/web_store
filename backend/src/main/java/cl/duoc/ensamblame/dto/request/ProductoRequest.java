package cl.duoc.ensamblame.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/** Datos para crear o editar un producto. "categoria" es el codigo de una categoria existente. */
public record ProductoRequest(

        @NotBlank(message = "El codigo (SKU) es obligatorio.")
        @Size(min = 3, max = 50, message = "El SKU debe tener entre 3 y 50 caracteres.")
        String sku,

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 100, message = "El nombre admite hasta 100 caracteres.")
        String nombre,

        @Size(max = 500, message = "La descripcion admite hasta 500 caracteres.")
        String descripcion,

        @NotNull(message = "El precio es obligatorio.")
        @DecimalMin(value = "0", message = "El precio no puede ser negativo.")
        BigDecimal precio,

        @Min(value = 0, message = "El descuento va de 0 a 90.")
        @Max(value = 90, message = "El descuento va de 0 a 90.")
        Integer descuento,

        @NotNull(message = "El stock es obligatorio.")
        @Min(value = 0, message = "El stock no puede ser negativo.")
        Integer stock,

        @Min(value = 0, message = "El stock critico no puede ser negativo.")
        Integer stockCritico,

        String imagen,

        String video,

        @NotBlank(message = "La categoria es obligatoria.")
        String categoria) {
}
