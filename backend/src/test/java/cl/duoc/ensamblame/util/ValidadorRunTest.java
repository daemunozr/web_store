package cl.duoc.ensamblame.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class ValidadorRunTest {

    @Test
    void aceptaUnRunConDigitoVerificadorCorrecto() {
        assertTrue(ValidadorRun.esValido("190110222"));
        assertTrue(ValidadorRun.esValido("123456785"));
    }

    @Test
    void aceptaUnRunConDigitoVerificadorK() {
        assertTrue(ValidadorRun.esValido("10000013K"));
        assertTrue(ValidadorRun.esValido("10000013k"));
    }

    @Test
    void aceptaUnRunDeSieteCaracteres() {
        assertTrue(ValidadorRun.esValido("12345674"));
    }

    @Test
    void rechazaUnDigitoVerificadorIncorrecto() {
        assertFalse(ValidadorRun.esValido("190110223"));
    }

    @Test
    void rechazaPuntosYGuion() {
        assertFalse(ValidadorRun.esValido("19.011.022-2"));
        assertFalse(ValidadorRun.esValido("19011022-2"));
    }

    @Test
    void rechazaUnLargoInvalidoVacioONulo() {
        assertFalse(ValidadorRun.esValido("12345"));
        assertFalse(ValidadorRun.esValido("1234567890"));
        assertFalse(ValidadorRun.esValido(""));
        assertFalse(ValidadorRun.esValido(null));
    }

    @Test
    void calculaElDigitoVerificador() {
        assertEquals("2", ValidadorRun.digitoVerificador("19011022"));
        assertEquals("K", ValidadorRun.digitoVerificador("10000013"));
        assertEquals("0", ValidadorRun.digitoVerificador("12345675"));
    }
}
