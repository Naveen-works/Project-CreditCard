package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDate;

@Data
@Document(collection = "applications")
public class CreditCardApplication {

    @Id
    private String id;

    private String applicantName;
    private String panCard;
    private String email;
    private LocalDate dob;
    private double annualIncome;

    private int creditScore;
    private double creditLimit;

    private String status; // PENDING / APPROVED / REJECTED / DISPATCHED
    private LocalDate appliedDate;
}