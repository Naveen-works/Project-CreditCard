package com.example.backend.controllers;

import com.example.backend.configs.JwtUtil;
import com.example.backend.models.User;
import com.example.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService service;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = service.register(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", savedUser.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            User user = service.login(email, password);
            String token = jwtUtil.generateToken(user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getRole() != null ? user.getRole() : "APPLICANT")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
