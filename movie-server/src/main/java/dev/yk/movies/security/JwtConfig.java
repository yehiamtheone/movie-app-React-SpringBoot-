package dev.yk.movies.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
public class JwtConfig {
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    @Bean
    public JwtDecoder jwtDecoder() {
        // Base64 encoded secret key (more secure)
        String base64Secret = SECRET_KEY;
        byte[] decodedKey = Base64.getDecoder().decode(base64Secret);

        SecretKeySpec secretKeySpec = new SecretKeySpec(decodedKey, "HmacSHA256");

        return NimbusJwtDecoder.withSecretKey(secretKeySpec).build();
    }
}