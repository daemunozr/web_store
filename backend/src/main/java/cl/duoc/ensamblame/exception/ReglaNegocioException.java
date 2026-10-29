package cl.duoc.ensamblame.exception;

/** Se lanza cuando la operacion rompe una regla: un duplicado o un registro en uso (responde 409). */
public class ReglaNegocioException extends RuntimeException {

    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
