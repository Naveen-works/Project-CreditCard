package com.example.backend.repositories;

import com.example.backend.models.CreditCardApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface ApplicationRepository
        extends MongoRepository<CreditCardApplication, String> {

    Optional<CreditCardApplication> findTopByPanCardOrderByAppliedDateDesc(String panCard);

    Optional<CreditCardApplication> findTopByEmailOrderByAppliedDateDesc(String email);
}