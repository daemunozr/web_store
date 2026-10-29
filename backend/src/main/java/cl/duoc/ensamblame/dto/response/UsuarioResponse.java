package cl.duoc.ensamblame.dto.response;

import cl.duoc.ensamblame.model.TipoUsuario;
import java.time.LocalDate;

/** Usuario tal como la ve el cliente de la API. No incluye la contrasena. */
public record UsuarioResponse(
        String run,
        String nombre,
        String apellidos,
        String correo,
        LocalDate fechaNacimiento,
        String region,
        String comuna,
        String direccion,
        TipoUsuario tipoUsuario) {
}
