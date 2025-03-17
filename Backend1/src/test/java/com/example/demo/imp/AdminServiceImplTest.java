package com.example.demo.imp;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AdminService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void testSignup() {
        // Arrange
        User user = new User();
        user.setUserName("admin");
        user.setPassword("password123");
        user.setRole("ADMIN");

        when(userRepository.findByUserName("admin")).thenReturn(Optional.empty());
        when(userRepository.save(user)).thenReturn(user);

        // Act
        ResponseEntity<?> response = adminService.signup(user);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Use getStatusCode() instead of getStatusCodeValue()
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testLogin() {
        // Arrange
        User user = new User();
        user.setUserName("admin");
        user.setPassword("password123");
        user.setRole("ADMIN");

        when(userRepository.findByUserName("admin")).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<?> response = adminService.login(user);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Use getStatusCode() instead of getStatusCodeValue()
    }
}