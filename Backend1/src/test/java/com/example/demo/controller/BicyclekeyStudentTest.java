package com.example.demo.controller;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.User;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BicycleKeyStudentTest {

    @Mock
    private BicycleRepository bicycleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentService studentService;

    @InjectMocks
    private StudentController studentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test for bookBicycle endpoint - Success case
    @Test
    void testBookBicycle_Success() {
        // Arrange
        Long bicycleId = 1L;
        Long userId = 1L;
        String successMessage = "Bicycle booked successfully by user ID: " + userId;
        
        when(studentService.bookBicycle(bicycleId, userId))
            .thenReturn(ResponseEntity.ok(successMessage));

        // Act
        ResponseEntity<String> response = studentController.bookBicycle(bicycleId, userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(successMessage, response.getBody());
        verify(studentService, times(1)).bookBicycle(bicycleId, userId);
    }

    // Test for bookBicycle endpoint - Bicycle not found
    @Test
    void testBookBicycle_BicycleNotFound() {
        // Arrange
        Long bicycleId = 1L;
        Long userId = 1L;
        
        when(studentService.bookBicycle(bicycleId, userId))
            .thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bicycle not found"));

        // Act
        ResponseEntity<String> response = studentController.bookBicycle(bicycleId, userId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Bicycle not found", response.getBody());
        verify(studentService, times(1)).bookBicycle(bicycleId, userId);
    }

    // Test for bookBicycle endpoint - Bicycle already booked
    @Test
    void testBookBicycle_AlreadyBooked() {
        // Arrange
        Long bicycleId = 1L;
        Long userId = 1L;
        
        when(studentService.bookBicycle(bicycleId, userId))
            .thenReturn(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bicycle is already booked"));

        // Act
        ResponseEntity<String> response = studentController.bookBicycle(bicycleId, userId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Bicycle is already booked", response.getBody());
        verify(studentService, times(1)).bookBicycle(bicycleId, userId);
    }

    // Test for listAvailableBicycles endpoint - Success with bicycles
    @Test
    void testListAvailableBicycles_Success() {
        // Arrange
        Bicycle bicycle1 = new Bicycle();
        bicycle1.setId(1L);
        bicycle1.setAvailable(true);
        
        Bicycle bicycle2 = new Bicycle();
        bicycle2.setId(2L);
        bicycle2.setAvailable(true);
        
        List<Bicycle> bicycles = Arrays.asList(bicycle1, bicycle2);
        
        when(studentService.listAvailableBicycles()).thenReturn(bicycles);

        // Act
        ResponseEntity<List<Bicycle>> response = studentController.listAvailableBicycles();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(studentService, times(1)).listAvailableBicycles();
    }

    // Test for listAvailableBicycles endpoint - Empty list
    @Test
    void testListAvailableBicycles_EmptyList() {
        // Arrange
        when(studentService.listAvailableBicycles()).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<Bicycle>> response = studentController.listAvailableBicycles();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(studentService, times(1)).listAvailableBicycles();
    }

    // Test for listAllBicycles endpoint - Success with bicycles
    @Test
    void testListAllBicycles_Success() {
        // Arrange
        Bicycle bicycle1 = new Bicycle();
        bicycle1.setId(1L);
        bicycle1.setAvailable(true);
        
        Bicycle bicycle2 = new Bicycle();
        bicycle2.setId(2L);
        bicycle2.setAvailable(false);
        
        List<Bicycle> bicycles = Arrays.asList(bicycle1, bicycle2);
        
        when(studentService.listAllBicycles()).thenReturn(bicycles);

        // Act
        ResponseEntity<List<Bicycle>> response = studentController.listAllBicycles();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(studentService, times(1)).listAllBicycles();
    }

    // Test for listAllBicycles endpoint - Empty list
    @Test
    void testListAllBicycles_EmptyList() {
        // Arrange
        when(studentService.listAllBicycles()).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<Bicycle>> response = studentController.listAllBicycles();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(studentService, times(1)).listAllBicycles();
    }
}