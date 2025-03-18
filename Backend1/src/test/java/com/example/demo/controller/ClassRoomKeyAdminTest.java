package com.example.demo.controller;

import com.example.demo.model.BorrowHistory;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
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
    
    
    // Testing for this api @PutMapping("/mark-key-available/{keyId}")
   
    
    /**
     * Success Test Case:
     * - The key is successfully marked as available.
     */
    @Test
    void testMarkKeyAsAvailable_Success() {
        // Arrange
        Long keyId = 1L;
        ClassroomKey key = new ClassroomKey();
        key.setId(keyId);
        key.setIsAvailable(0); // Initially marked as borrowed

        // Mock the repository to return the key
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(key));

        // Act
        ResponseEntity<?> response = adminController.markKeyAsAvailable(keyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Key marked as available successfully", response.getBody());
        assertEquals(1, key.getIsAvailable()); // Verify the key is marked as available
        verify(classroomKeyRepository, times(1)).save(key);
    }

    /**
     * Key Not Found Test Case:
     * - The key with the given keyId does not exist.
     */
    @Test
    void testMarkKeyAsAvailable_KeyNotFound() {
        // Arrange
        Long keyId = 1L;

        // Mock the repository to return an empty Optional (key not found)
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = adminController.markKeyAsAvailable(keyId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Key not found", response.getBody());
        verify(classroomKeyRepository, never()).save(any(ClassroomKey.class));
    }

    /**
     * Database Error Test Case:
     * - An exception occurs while saving the key (e.g., database error).
     */
    @Test
    void testMarkKeyAsAvailable_DatabaseError() {
        // Arrange
        Long keyId = 1L;
        ClassroomKey key = new ClassroomKey();
        key.setId(keyId);
        key.setIsAvailable(0); // Initially marked as borrowed

        // Mock the repository to return the key
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(key));

        // Mock the repository to throw an exception when saving
        when(classroomKeyRepository.save(key)).thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<?> response = adminController.markKeyAsAvailable(keyId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error marking key as available", response.getBody());
    }

    /**
     * Edge Case: Null Key ID
     * - The keyId is null.
     */
    @Test
    void testMarkKeyAsAvailable_NullKeyId() {
        // Arrange
        Long keyId = null;

        // Act
        ResponseEntity<?> response = adminController.markKeyAsAvailable(keyId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Key ID cannot be null", response.getBody());
        verify(classroomKeyRepository, never()).findById(any());
        verify(classroomKeyRepository, never()).save(any(ClassroomKey.class));
    }
    
    
    //Testing for  @DeleteMapping("/delete-key/{keyId}")
    
   
    /**
     * Success Test Case:
     * - The key is successfully deleted.
     */
    @Test
    void testDeleteKey_Success() {
        // Arrange
        Long keyId = 1L;

        // Mock the repository to return true for existsById
        when(classroomKeyRepository.existsById(keyId)).thenReturn(true);

        // Mock the repository to do nothing when deleteById is called
        doNothing().when(classroomKeyRepository).deleteById(keyId);

        // Act
        ResponseEntity<?> response = adminController.deleteKey(keyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Key deleted successfully", response.getBody());
        verify(classroomKeyRepository, times(1)).existsById(keyId); // Verify existsById is called
        verify(classroomKeyRepository, times(1)).deleteById(keyId); // Verify deleteById is called
    }

    /**
     * Key Not Found Test Case:
     * - The key with the given keyId does not exist.
     */
    @Test
    void testDeleteKey_KeyNotFound() {
        // Arrange
        Long keyId = 1L;

        // Mock the repository to return false for existsById
        when(classroomKeyRepository.existsById(keyId)).thenReturn(false);

        // Act
        ResponseEntity<?> response = adminController.deleteKey(keyId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Key not found", response.getBody());
        verify(classroomKeyRepository, never()).deleteById(keyId);
    }
    
    /**
     * Database Error Test Case:
     * - An exception occurs while deleting the key (e.g., database error).
     */
    @Test
    void testDeleteKey_DatabaseError() {
        // Arrange
        Long keyId = 1L;

        // Mock the repository to return true for existsById
        when(classroomKeyRepository.existsById(keyId)).thenReturn(true);

        // Mock the repository to throw a runtime exception when deleteById is called
        doThrow(new RuntimeException("Database error")).when(classroomKeyRepository).deleteById(keyId);

        // Act
        ResponseEntity<?> response = adminController.deleteKey(keyId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error deleting key", response.getBody());
        verify(classroomKeyRepository, times(1)).existsById(keyId); // Verify existsById is called
        verify(classroomKeyRepository, times(1)).deleteById(keyId); // Verify deleteById is called
    }

    /**
     * Edge Case: Null Key ID
     * - The keyId is null.
     */
    @Test
    void testDeleteKey_NullKeyId() {
        // Arrange
        Long keyId = null;

        // Act
        ResponseEntity<?> response = adminController.deleteKey(keyId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Key ID cannot be null", response.getBody());
        verify(classroomKeyRepository, never()).deleteById(any());
    }

    /**
     * Edge Case: Invalid Key ID
     * - The keyId is invalid (e.g., negative or zero).
     */
    @Test
    void testDeleteKey_InvalidKeyId() {
        // Arrange
        Long keyId = -1L; // Invalid key ID

        // Act
        ResponseEntity<?> response = adminController.deleteKey(keyId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid Key ID", response.getBody());
        verify(classroomKeyRepository, never()).deleteById(any());
    }
    
    
    
    // Test: listAvailableKeys - Should return available keys successfully
    @Test
    void testListAvailableKeys_Success() {
        // Arrange
        ClassroomKey key = new ClassroomKey();
        key.setId(1L);
        key.setClassroomName("Room 101");
        key.setIsAvailable(1);
        List<ClassroomKey> availableKeys = Arrays.asList(key);
        
        when(adminService.listAvailableKeys()).thenReturn(availableKeys);

        // Act
        ResponseEntity<List<ClassroomKey>> response = adminController.listAvailableKeys();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(adminService, times(1)).listAvailableKeys();
    }

    // Test: listAvailableKeys - Should return empty list when no keys are available
    @Test
    void testListAvailableKeys_NoKeys() {
        when(adminService.listAvailableKeys()).thenReturn(Collections.emptyList());

        ResponseEntity<List<ClassroomKey>> response = adminController.listAvailableKeys();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    // Test: listAllKeys - Should return all keys successfully
    @Test
    void testListAllKeys_Success() {
        ClassroomKey key1 = new ClassroomKey();
        key1.setId(1L);
        key1.setClassroomName("Room 101");
        key1.setIsAvailable(1);

        ClassroomKey key2 = new ClassroomKey();
        key2.setId(2L);
        key2.setClassroomName("Room 102");
        key2.setIsAvailable(0);

        List<ClassroomKey> allKeys = Arrays.asList(key1, key2);
        when(adminService.listAllKeys()).thenReturn(allKeys);

        ResponseEntity<List<ClassroomKey>> response = adminController.listAllKeys();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    // Test: listAllKeys - Should return empty list when no keys are found
    @Test
    void testListAllKeys_NoKeys() {
        when(adminService.listAllKeys()).thenReturn(Collections.emptyList());

        ResponseEntity<List<ClassroomKey>> response = adminController.listAllKeys();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    // Test: getRecentlyAddedKeys - Should return recently added keys successfully
    @Test
    void testGetRecentlyAddedKeys_Success() {
        ClassroomKey key = new ClassroomKey();
        key.setId(3L);
        key.setClassroomName("Room 103");
        key.setIsAvailable(1);
        
        List<ClassroomKey> recentKeys = Arrays.asList(key);
        when(adminService.getRecentlyAddedKeys()).thenReturn(recentKeys);

        ResponseEntity<List<ClassroomKey>> response = adminController.getRecentlyAddedKeys();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    // Test: getRecentlyAddedKeys - Should return empty list when no recent keys are found
    @Test
    void testGetRecentlyAddedKeys_NoKeys() {
        when(adminService.getRecentlyAddedKeys()).thenReturn(Collections.emptyList());

        ResponseEntity<List<ClassroomKey>> response = adminController.getRecentlyAddedKeys();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    // Test: getAllKeyHistory - Should return key borrowing history successfully
    @Test
    void testGetAllKeyHistory_Success() {
        BorrowHistory history = new BorrowHistory();
        history.setId(1L);
        history.setFeedback("Good condition");

        List<BorrowHistory> keyHistory = Arrays.asList(history);
        when(adminService.getAllKeyHistory()).thenReturn(keyHistory);

        ResponseEntity<List<BorrowHistory>> response = adminController.getAllKeyHistory();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    // Test: getAllKeyHistory - Should return empty list when no history is available
    @Test
    void testGetAllKeyHistory_NoHistory() {
        when(adminService.getAllKeyHistory()).thenReturn(Collections.emptyList());

        ResponseEntity<List<BorrowHistory>> response = adminController.getAllKeyHistory();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    // Test: getCurrentlyBorrowedKeys - Should return currently borrowed keys successfully
    @Test
    void testGetCurrentlyBorrowedKeys_Success() {
        BorrowHistory borrowedKey = new BorrowHistory();
        borrowedKey.setId(2L);
        borrowedKey.setFeedback("Not yet returned");

        List<BorrowHistory> borrowedKeys = Arrays.asList(borrowedKey);
        when(adminService.getCurrentlyBorrowedKeys()).thenReturn(borrowedKeys);

        ResponseEntity<List<BorrowHistory>> response = adminController.getCurrentlyBorrowedKeys();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    // Test: getCurrentlyBorrowedKeys - Should return empty list when no borrowed keys are found
    @Test
    void testGetCurrentlyBorrowedKeys_NoBorrowedKeys() {
        when(adminService.getCurrentlyBorrowedKeys()).thenReturn(Collections.emptyList());

        ResponseEntity<List<BorrowHistory>> response = adminController.getCurrentlyBorrowedKeys();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }
    

    
}