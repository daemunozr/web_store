package cl.duoc.ensamblame.util;

/** Valida el RUN chileno (sin puntos ni guion) con el digito verificador. */
public final class ValidadorRun {

    private ValidadorRun() {
    }

    /** Calcula el digito verificador de un cuerpo numerico con el metodo del modulo 11. */
    public static String digitoVerificador(String cuerpo) {
        int suma = 0;
        int factor = 2;

        // Se recorre de derecha a izquierda con los factores 2, 3, 4, 5, 6, 7, 2, 3...
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * factor;
            factor = (factor == 7) ? 2 : factor + 1;
        }

        int resto = 11 - (suma % 11);
        if (resto == 11) {
            return "0";
        }
        if (resto == 10) {
            return "K";
        }
        return String.valueOf(resto);
    }

    /** Un RUN valido tiene de 7 a 9 caracteres: el cuerpo en digitos y el verificador al final. */
    public static boolean esValido(String run) {
        if (run == null) {
            return false;
        }
        String limpio = run.trim().toUpperCase();
        if (!limpio.matches("[0-9]{6,8}[0-9K]")) {
            return false;
        }
        String cuerpo = limpio.substring(0, limpio.length() - 1);
        String verificador = limpio.substring(limpio.length() - 1);
        return digitoVerificador(cuerpo).equals(verificador);
    }
}
