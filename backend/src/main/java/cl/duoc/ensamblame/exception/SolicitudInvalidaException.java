package cl.duoc.ensamblame.exception;

/** Se lanza cuando un dato no cumple una regla que la validacion de campos no alcanza a revisar (responde 400). */
public class SolicitudInvalidaException extends RuntimeException {

    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
    }
}
