package com.example.backend.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtRequestFilter jwtRequestFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                // 🔴 Disable CSRF (important for Postman POST)
                                .csrf(csrf -> csrf.disable())

                                // 🌐 Enable CORS
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // 🔐 Authorization rules
                                .authorizeHttpRequests(auth -> auth

                                                // Public APIs
                                                .requestMatchers("/auth/**").permitAll()
                                                .requestMatchers("/applicant/apply").permitAll() // Keep public for now
                                                                                                 // or secure if needed
                                                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**",
                                                                "/swagger-ui.html", "/webjars/**")
                                                .permitAll() // Swagger
                                                .requestMatchers("/hello").permitAll()

                                                // Role based
                                                .requestMatchers("/api/approver/**").hasAuthority("APPROVER")
                                                .requestMatchers("/applicant/me").authenticated() // Secure this

                                                // Everything else secured
                                                .anyRequest().authenticated())

                                // Stateless session (JWT)
                                .sessionManagement(sess -> sess.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                // Add JWT Filter
                                .addFilterBefore(jwtRequestFilter,
                                                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // Authentication manager bean
        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:5174",
                                "http://localhost:5175", "http://localhost:5176", "http://localhost:5177",
                                "http://localhost:5178")); // Allow frontend ports
                configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(java.util.List.of("*"));
                configuration.setAllowCredentials(true);

                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
