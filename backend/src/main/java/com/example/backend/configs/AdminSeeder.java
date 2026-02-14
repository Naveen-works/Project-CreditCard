package com.example.backend.configs;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword("admin123"); // Plain text as requested
            admin.setRole("APPROVER");

            userRepository.save(admin);
            System.out.println("Admin user created: admin@example.com / admin123");
        }
    }
}
