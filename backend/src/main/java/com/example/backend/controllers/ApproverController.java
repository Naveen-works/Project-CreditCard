package com.example.backend.controllers;

import com.example.backend.models.CreditCardApplication;
import com.example.backend.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/approver")
@RequiredArgsConstructor
public class ApproverController {

    private final ApplicationService service;

    @GetMapping("/applications")
    public List<CreditCardApplication> getAllApplications() {
        return service.getAllApplications();
    }

    @PutMapping("/approve/{id}")
    public CreditCardApplication approve(@PathVariable String id) {
        return service.approve(id);
    }

    @PutMapping("/dispatch/{id}")
    public CreditCardApplication dispatch(@PathVariable String id) {
        return service.dispatch(id);
    }
}