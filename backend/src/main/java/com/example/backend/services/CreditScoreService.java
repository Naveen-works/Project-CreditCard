package com.example.backend.services;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class CreditScoreService {

    public int getCreditScore(String pan) {

        // Mock logic (replace with real API)
        return 650 + new Random().nextInt(300);
    }
}