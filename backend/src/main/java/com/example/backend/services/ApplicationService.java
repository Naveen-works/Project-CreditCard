package com.example.backend.services;

import com.example.backend.dtos.ApplicationRequest;
import com.example.backend.models.CreditCardApplication;
import com.example.backend.repositories.ApplicationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository repo;
    private final CreditScoreService scoreService;

    public List<CreditCardApplication> getAllApplications() {
        return repo.findAll();
    }

    public CreditCardApplication getLatestApplication(String email) {
        return repo.findTopByEmailOrderByAppliedDateDesc(email)
                .orElse(null);
    }

    public CreditCardApplication apply(ApplicationRequest req) {

        log.info("New application for PAN {}", req.getPanCard());

        int age = Period.between(req.getDob(), LocalDate.now()).getYears();
        if (age < 18)
            throw new RuntimeException("Applicant must be > 18");

        repo.findTopByPanCardOrderByAppliedDateDesc(req.getPanCard())
                .ifPresent(app -> {
                    if (app.getAppliedDate()
                            .isAfter(LocalDate.now().minusMonths(6))) {
                        throw new RuntimeException(
                                "Application already exists in last 6 months");
                    }
                });

        int score = scoreService.getCreditScore(req.getPanCard());

        CreditCardApplication app = new CreditCardApplication();
        app.setApplicantName(req.getApplicantName());
        app.setPanCard(req.getPanCard());
        app.setEmail(req.getEmail());
        app.setDob(req.getDob());
        app.setAnnualIncome(req.getAnnualIncome());
        app.setAppliedDate(LocalDate.now());
        app.setCreditScore(score);
        app.setStatus("PENDING");
        app.setCreditLimit(calculateLimit(req.getAnnualIncome()));

        return repo.save(app);
    }

    private double calculateLimit(double income) {

        if (income <= 200000)
            return 50000;
        if (income <= 300000)
            return 75000;
        if (income <= 500000)
            return 1000000;
        return 0;
    }

    public CreditCardApplication approve(String id) {

        CreditCardApplication app = repo.findById(id)
                .orElseThrow();

        if (app.getCreditScore() > 800)
            app.setStatus("APPROVED");
        else
            app.setStatus("REJECTED");

        return repo.save(app);
    }

    public CreditCardApplication dispatch(String id) {

        CreditCardApplication app = repo.findById(id)
                .orElseThrow();

        if (!app.getStatus().equals("APPROVED"))
            throw new RuntimeException("Not approved");

        app.setStatus("DISPATCHED");
        return repo.save(app);
    }
}
