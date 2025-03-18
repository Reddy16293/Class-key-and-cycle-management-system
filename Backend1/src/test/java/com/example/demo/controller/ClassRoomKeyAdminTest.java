package com.example.demo.controller;

import com.example.demo.model.ClassroomKey;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClassRoomKeyAdminTest {

    @Mock
    private ClassroomKeyRepository classroomKeyRepository;

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
    }

    
    // Testing fot this api @PutMapping("/mark-key-borrowed/{keyId}")
    
    @Test
    void testMarkKeyAsBorrowed_Success() {
        // Arrange
        Long keyId = 1L;
        ClassroomKey key = new ClassroomKey();
        key.setId(keyId);
        key.setIsAvailable(1);

        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(key));

        // Act
        ResponseEntity<?> response = adminController.markKeyAsBorrowed(keyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Key marked as borrowed successfully", response.getBody());
        assertEquals(0, key.getIsAvailable()); // Check if key is marked as borrowed
        verify(classroomKeyRepository, times(1)).save(key);
    }

    @Test
    void testMarkKeyAsBorrowed_NotFound() {
        // Arrange
        Long keyId = 1L;
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = adminController.markKeyAsBorrowed(keyId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Key not found", response.getBody());
        verify(classroomKeyRepository, never()).save(any(ClassroomKey.class));
    }
    
    
    // Testing fot this api @PostMapping("/addclassrooms")
    
    @Test
    void testAddClassroom_Success() {
        // Arrange
        ClassroomKey classroomKey = new ClassroomKey();
        classroomKey.setBlockName("Block A");
        classroomKey.setClassroomName("Room 101");

        // Mock the repository to return an empty Optional (classroom does not exist)
        when(classroomKeyRepository.findByBlockNameAndClassroomName("Block A", "Room 101"))
            .thenReturn(Optional.empty());

        // Act
        String response = adminController.addClassroom(classroomKey).getBody();

        // Assert
        assertEquals("Classroom added successfully", response);
        verify(classroomKeyRepository, times(1)).save(classroomKey);
    }

    @Test
    void testAddClassroom_Conflict() {
        // Arrange
        ClassroomKey classroomKey = new ClassroomKey();
        classroomKey.setBlockName("Block A");
        classroomKey.setClassroomName("Room 101");

        // Mock the repository to return an existing classroom (classroom already exists)
        when(classroomKeyRepository.findByBlockNameAndClassroomName("Block A", "Room 101"))
            .thenReturn(Optional.of(classroomKey));

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            adminController.addClassroom(classroomKey);
        });

        // Verify the exception details
        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("Classroom already exists", exception.getReason());
        verify(classroomKeyRepository, never()).save(any(ClassroomKey.class));
    }
}