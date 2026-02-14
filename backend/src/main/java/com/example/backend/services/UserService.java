package com.example.backend.services;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.UserDetailsService;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository repo;

    public User register(User user) {

        if (repo.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already exists");

        // Simple plain text password for now as requested
        return repo.save(user);
    }

    public User login(String email, String password) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String email)
            throws org.springframework.security.core.userdetails.UsernameNotFoundException {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException(
                        "User not found"));

        // Convert role to Authority
        java.util.List<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();
        if (user.getRole() != null) {
            authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole()));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities);
    }
}
