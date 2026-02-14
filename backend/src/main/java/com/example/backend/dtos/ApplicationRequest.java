package com.example.backend.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ApplicationRequest {

    private String applicantName;
    private String panCard;
    private String email;
    private LocalDate dob;
    private double annualIncome;
}
