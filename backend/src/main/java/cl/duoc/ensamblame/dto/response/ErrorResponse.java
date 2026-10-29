package cl.duoc.ensamblame.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

/** Cuerpo de todas las respuestas de error. "errores" lleva el mensaje de cada campo invalido (puede ser null). */
public record ErrorResponse(int estado, String mensaje, Map<String, String> errores, LocalDateTime fecha) {
}
