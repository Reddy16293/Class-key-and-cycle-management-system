package com.example.demo.controller;

import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClassKeyStudentTest {

    @Mock
    private ClassroomKeyRepository classroomKeyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BorrowHistoryRepository borrowHistoryRepository;

    @Mock
    private StudentService studentService;

    @InjectMocks
    private StudentController studentController;

    private MockHttpServletRequest mockRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockRequest = new MockHttpServletRequest();
    }

    // Test for bookClassroomKey - Success case
    @Test
    void testBookClassroomKey_Success() {
        // Arrange
        Long keyId = 1L;
        Long userId = 1L;
        
        ClassroomKey key = new ClassroomKey();
        key.setId(keyId);
        key.setIsAvailable(1);
        
        User user = new User();
        user.setId(userId);
        user.setName("Test User");

        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(key));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<String> response = studentController.bookClassroomKey(keyId, userId, mockRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Key successfully booked by Test User", response.getBody());
        assertEquals(0, key.getIsAvailable()); // Verify key is marked as borrowed
        verify(classroomKeyRepository, times(1)).save(key);
        verify(borrowHistoryRepository, times(1)).save(any(BorrowHistory.class));
    }

    // Test for bookClassroomKey - Key not found
    @Test
    void testBookClassroomKey_KeyNotFound() {
        // Arrange
        Long keyId = 1L;
        Long userId = 1L;
        
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));

        // Act
        ResponseEntity<String> response = studentController.bookClassroomKey(keyId, userId, mockRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid key or user ID", response.getBody());
        verify(classroomKeyRepository, never()).save(any());
        verify(borrowHistoryRepository, never()).save(any());
    }

    // Test for bookClassroomKey - User not found
    @Test
    void testBookClassroomKey_UserNotFound() {
        // Arrange
        Long keyId = 1L;
        Long userId = 1L;
        
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(new ClassroomKey()));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<String> response = studentController.bookClassroomKey(keyId, userId, mockRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid key or user ID", response.getBody());
        verify(classroomKeyRepository, never()).save(any());
        verify(borrowHistoryRepository, never()).save(any());
    }

    // Test for bookClassroomKey - Key already borrowed
    @Test
    void testBookClassroomKey_KeyAlreadyBorrowed() {
        // Arrange
        Long keyId = 1L;
        Long userId = 1L;
        
        ClassroomKey key = new ClassroomKey();
        key.setId(keyId);
        key.setIsAvailable(0); // Already borrowed
        
        User user = new User();
        user.setId(userId);

        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(key));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<String> response = studentController.bookClassroomKey(keyId, userId, mockRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Key is already borrowed", response.getBody());
        verify(classroomKeyRepository, never()).save(any());
        verify(borrowHistoryRepository, never()).save(any());
    }

    // Test for getAvailableRooms with block and floor - Success case
    @Test
    void testGetAvailableRoomsWithBlockAndFloor_Success() {
        // Arrange
        String blockName = "A";
        String floor = "1";
        
        ClassroomKey key1 = new ClassroomKey();
        key1.setId(1L);
        key1.setBlockName(blockName);
        key1.setFloor(floor);
        key1.setIsAvailable(1);
        
        ClassroomKey key2 = new ClassroomKey();
        key2.setId(2L);
        key2.setBlockName(blockName);
        key2.setFloor(floor);
        key2.setIsAvailable(1);
        
        List<ClassroomKey> availableKeys = Arrays.asList(key1, key2);
        
        when(classroomKeyRepository.findByBlockNameAndFloorAndIsAvailable(blockName, floor, 1))
            .thenReturn(availableKeys);

        // Act
        ResponseEntity<List<ClassroomKey>> response = 
            studentController.getAvailableRooms(blockName, floor);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, response.getHeaders().getContentType());
        assertEquals(2, response.getBody().size());
    }

    // Test for getAvailableRooms with block and floor - No available rooms
    @Test
    void testGetAvailableRoomsWithBlockAndFloor_NoAvailableRooms() {
        // Arrange
        String blockName = "A";
        String floor = "1";
        
        when(classroomKeyRepository.findByBlockNameAndFloorAndIsAvailable(blockName, floor, 1))
            .thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<ClassroomKey>> response = 
            studentController.getAvailableRooms(blockName, floor);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    // Test for getAllKeysOnFloor - Success case
    @Test
    void testGetAllKeysOnFloor_Success() {
        // Arrange
        String blockName = "B";
        String floor = "2";
        
        ClassroomKey key1 = new ClassroomKey();
        key1.setId(1L);
        key1.setBlockName(blockName);
        key1.setFloor(floor);
        key1.setIsAvailable(1);
        
        ClassroomKey key2 = new ClassroomKey();
        key2.setId(2L);
        key2.setBlockName(blockName);
        key2.setFloor(floor);
        key2.setIsAvailable(0); // Borrowed
        
        List<ClassroomKey> allKeys = Arrays.asList(key1, key2);
        
        when(classroomKeyRepository.findByBlockNameAndFloor(blockName, floor))
            .thenReturn(allKeys);

        // Act
        ResponseEntity<List<ClassroomKey>> response = 
            studentController.getAllKeysOnFloor(blockName, floor);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, response.getHeaders().getContentType());
        assertEquals(2, response.getBody().size());
    }

    // Test for getAllKeysOnFloor - No keys found
    @Test
    void testGetAllKeysOnFloor_NoKeysFound() {
        // Arrange
        String blockName = "B";
        String floor = "2";
        
        when(classroomKeyRepository.findByBlockNameAndFloor(blockName, floor))
            .thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<ClassroomKey>> response = 
            studentController.getAllKeysOnFloor(blockName, floor);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    // Test for checkKeyAvailability - Key available
    @Test
    void testCheckKeyAvailability_KeyAvailable() {
        // Arrange
        Long keyId = 1L;
        ClassroomKey key = new ClassroomKey();
        key.setId(keyId);
        key.setIsAvailable(1);
        
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(key));

        // Act
        ResponseEntity<Integer> response = studentController.checkKeyAvailability(keyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody());
    }

    // Test for checkKeyAvailability - Key not available
    @Test
    void testCheckKeyAvailability_KeyNotAvailable() {
        // Arrange
        Long keyId = 1L;
        ClassroomKey key = new ClassroomKey();
        key.setId(keyId);
        key.setIsAvailable(0);
        
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.of(key));

        // Act
        ResponseEntity<Integer> response = studentController.checkKeyAvailability(keyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody());
    }

    // Test for checkKeyAvailability - Key not found
    @Test
    void testCheckKeyAvailability_KeyNotFound() {
        // Arrange
        Long keyId = 1L;
        
        when(classroomKeyRepository.findById(keyId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Integer> response = studentController.checkKeyAvailability(keyId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(0, response.getBody());
    }

    // Test for getAvailableRooms (all) - Success case
    @Test
    void testGetAvailableRooms_Success() {
        // Arrange
        when(studentService.getAvailableRooms())
            .thenReturn(ResponseEntity.ok(Collections.singletonList(Map.of("block", "A", "floor", "1"))));

        // Act
        ResponseEntity<List<Map<String, Object>>> response = studentController.getAvailableRooms();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }
}