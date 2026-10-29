package cl.duoc.ensamblame.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(int estado, String mensaje, Map<String, String> errores, LocalDateTime fecha) {
}
