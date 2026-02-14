package com.example.backend.controllers;

import com.example.backend.dtos.ApplicationRequest;
import com.example.backend.models.CreditCardApplication;
import com.example.backend.services.ApplicationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/applicant")
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicationService service;

    // ✅ Apply credit card
    @PostMapping("/apply")
    public ResponseEntity<CreditCardApplication> apply(
            @RequestBody ApplicationRequest request) {

        CreditCardApplication response = service.apply(request);

        return ResponseEntity.ok(response);
    }

    // ✅ Get Current User Application Status
    @GetMapping("/me")
    public ResponseEntity<CreditCardApplication> getMyApplication(
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();
        CreditCardApplication app = service.getLatestApplication(email);

        if (app == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(app);
    }
}
