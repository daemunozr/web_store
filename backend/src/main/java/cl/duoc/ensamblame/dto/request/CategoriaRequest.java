package cl.duoc.ensamblame.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Datos para crear o editar una categoria. */
public record CategoriaRequest(

        @NotBlank(message = "El codigo es obligatorio.")
        @Size(min = 3, max = 30, message = "El codigo debe tener entre 3 y 30 caracteres.")
        @Pattern(regexp = "[a-z0-9-]*", message = "El codigo solo admite minusculas, numeros y guiones.")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 50, message = "El nombre admite hasta 50 caracteres.")
        String nombre,

        Integer orden) {
}
