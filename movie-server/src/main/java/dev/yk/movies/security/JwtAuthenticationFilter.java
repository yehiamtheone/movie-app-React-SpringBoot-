package dev.yk.movies.security;

import dev.yk.movies.JwtService;
import dev.yk.movies.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userId;

        // 1. Check if the Authorization header and JWT are present
        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.equalsIgnoreCase("Bearer null")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract the JWT and user ID
        jwt = authHeader.substring(7);
        try {
            userId = jwtService.extractId(jwt);
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 4. Load the user from the database
                UserDetails userDetails = userService.loadUserById(new ObjectId(userId))
                        .orElse(null);
                // 5. Validate the token and user details
                if (userDetails != null && jwtService.isTokenValid(jwt, userDetails)) {

                    // 6. Create an authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // Set the authentication details from the request
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // 7. Set the authentication token in the SecurityContextHolder
                    // This is the final and most crucial step!
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException expired) {
            System.out.println("test");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"INVALID_TOKEN\"}");
            return;
        }


        // 3. Authenticate the user if the security context is empty


        filterChain.doFilter(request, response);
    }
}