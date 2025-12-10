package dev.yk.movies;

import dev.yk.movies.dtos.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    // A single, clear method to generate a token from a UserDetails object
    // In your JwtService
    public String generateToken(CustomUserDetails userDetails, String username) {
        Map<String, Object> claims = new HashMap<>();
        CustomUserDetails customUserDetails = userDetails;

        // Build the claims to include the user's roles
        // Map GrantedAuthority objects to a List of strings
        List<String> roles = userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toList()); // <--- This is the fix

        // Use the user's ID as the subject for our token
        String userId = userDetails.getUsername();
        claims.put("roles", roles);
        claims.put("username", username);
        return Jwts.builder()
                // It will now add the roles as a List, which is what Spring Security expects
                .setClaims(claims)
                .setSubject(userId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
//                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 10))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userId = extractId(token);

        return (userId.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public String extractId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}