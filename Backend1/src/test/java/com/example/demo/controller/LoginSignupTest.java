package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LoginSignupTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignup2_Success() {
        // Arrange
        User admin = new User();
        admin.setEmail("admin@example.com");
        admin.setPassword("password123");

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");

        // Act
        ResponseEntity<String> response = adminController.signup2(admin);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Admin registered successfully.", response.getBody());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testSignup2_EmailAlreadyInUse() {
        // Arrange
        User admin = new User();
        admin.setEmail("admin@example.com");
        admin.setPassword("password123");

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(new User()));

        // Act
        ResponseEntity<String> response = adminController.signup2(admin);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email already in use.", response.getBody());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogin2_Success() {
        // Arrange
        User admin = new User();
        admin.setUserName("adminUser");
        admin.setPassword("hashedPassword");
        admin.setRole("ADMIN");

        when(userRepository.findByUserName("adminUser")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);

        // Act
        ResponseEntity<?> response = adminController.loginAdmin(Map.of("userName", "adminUser", "password", "password123"));

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Login successful", ((Map<?, ?>) response.getBody()).get("message"));
        assertEquals("ADMIN", ((Map<?, ?>) response.getBody()).get("role"));
    }

    @Test
    void testLogin2_InvalidUsername() {
        // Arrange
        when(userRepository.findByUserName("nonExistentUser")).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = adminController.loginAdmin(Map.of("userName", "nonExistentUser", "password", "password123"));

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid username or password", ((Map<?, ?>) response.getBody()).get("error"));
    }

    @Test
    void testLogin2_InvalidPassword() {
        // Arrange
        User admin = new User();
        admin.setUserName("adminUser");
        admin.setPassword("hashedPassword");

        when(userRepository.findByUserName("adminUser")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act
        ResponseEntity<?> response = adminController.loginAdmin(Map.of("userName", "adminUser", "password", "wrongPassword"));

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid username or password", ((Map<?, ?>) response.getBody()).get("error"));
    }
}