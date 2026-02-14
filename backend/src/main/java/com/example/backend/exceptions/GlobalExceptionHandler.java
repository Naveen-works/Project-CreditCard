package com.example.backend.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handle(RuntimeException ex) {

        return ResponseEntity
                .badRequest()
                .body(java.util.Map.of("error", ex.getMessage()));
    }
}
