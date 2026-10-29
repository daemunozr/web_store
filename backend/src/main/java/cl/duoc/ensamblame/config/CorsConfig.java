package cl.duoc.ensamblame.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Permite que el frontend (Vite, en otro puerto) llame a la API desde el navegador. */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Se lee de application.yml (app.cors.origen).
    @Value("${app.cors.origen}")
    private String origenPermitido;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(origenPermitido)
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
