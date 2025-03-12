package com.example.demo.controller;

import com.example.demo.model.Fake;
import com.example.demo.repository.FakeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class UserController {

    private final FakeRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(FakeRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup1")
    public ResponseEntity<String> signup(@RequestBody Fake admin) {
        System.out.println("Received Signup Request: " + admin.getEmail()); // Debugging log

        if (userRepository.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword())); // Hash the password
        admin.setRole("ADMIN");
        userRepository.save(admin);
        
        return ResponseEntity.ok("Admin registered successfully.");
    }

    @PostMapping("/login3")
    public ResponseEntity<String> login(@RequestBody Fake admin) {
        Optional<Fake> userOptional = userRepository.findByEmail(admin.getEmail());

        if (userOptional.isPresent()) {
            Fake user = userOptional.get();

            if (!"ADMIN".equals(user.getRole())) {
                return ResponseEntity.badRequest().body("Only admins can log in using this endpoint.");
            }

            if (passwordEncoder.matches(admin.getPassword(), user.getPassword())) {
                return ResponseEntity.ok("Login successful.");
            }
        }

        return ResponseEntity.status(401).body("Invalid credentials.");
    }
}
