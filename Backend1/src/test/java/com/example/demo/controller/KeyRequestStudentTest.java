package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class KeyRequestStudentTest {

    @Mock
    private KeyRequestRepository keyRequestRepository;

    @Mock
    private ClassroomKeyRepository classroomKeyRepository;

    @Mock
    private BorrowHistoryRepository borrowHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private KeyRequestController keyRequestController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCheckPendingRequest_NoPendingRequest() {
        // Arrange
        Long userId = 1L;
        Long keyId = 1L;
        
        when(keyRequestRepository.existsByStudentIdAndClassroomKeyIdAndStatusIn(
            userId, keyId, Arrays.asList("PENDING", "APPROVED")))
            .thenReturn(false);

        // Act
        ResponseEntity<?> response = keyRequestController.checkPendingRequest(userId, keyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(((Map<?, ?>) response.getBody()).get("hasPendingRequest"));
    }

    @Test
    void testCheckPendingRequest_HasPendingRequest() {
        // Arrange
        Long userId = 1L;
        Long keyId = 1L;
        
        when(keyRequestRepository.existsByStudentIdAndClassroomKeyIdAndStatusIn(
            userId, keyId, Arrays.asList("PENDING", "APPROVED")))
            .thenReturn(true);

        // Act
        ResponseEntity<?> response = keyRequestController.checkPendingRequest(userId, keyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(((Map<?, ?>) response.getBody()).get("hasPendingRequest"));
    }

    @Test
    void testCheckPendingRequest_Error() {
        // Arrange
        Long userId = 1L;
        Long keyId = 1L;
        
        when(keyRequestRepository.existsByStudentIdAndClassroomKeyIdAndStatusIn(
            userId, keyId, Arrays.asList("PENDING", "APPROVED")))
            .thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<?> response = keyRequestController.checkPendingRequest(userId, keyId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to check pending requests", 
            ((Map<?, ?>) response.getBody()).get("error"));
    }

    @Test
    void testRequestKey_Success() {
        // Arrange
        Long studentId = 1L;
        Long classroomKeyId = 1L;
        String startTime = "2023-06-01T10:00";
        String endTime = "2023-06-01T12:00";
        String purpose = "Lecture";
        
        User student = new User();
        student.setId(studentId);
        
        ClassroomKey classroomKey = new ClassroomKey();
        classroomKey.setId(classroomKeyId);
        
        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(classroomKeyRepository.findById(classroomKeyId)).thenReturn(Optional.of(classroomKey));

        // Act
        ResponseEntity<String> response = keyRequestController.requestKey(
            studentId, classroomKeyId, startTime, endTime, purpose);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Key request submitted successfully", response.getBody());
        verify(keyRequestRepository, times(1)).save(any(KeyRequest.class));
    }

    @Test
    void testRequestKey_InvalidTimeFormat() {
        // Arrange
        Long studentId = 1L;
        Long classroomKeyId = 1L;
        String startTime = "invalid-time";
        String endTime = "2023-06-01T12:00";
        String purpose = "Lecture";

        // Act
        ResponseEntity<String> response = keyRequestController.requestKey(
            studentId, classroomKeyId, startTime, endTime, purpose);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("Invalid time format"));
    }

    @Test
    void testRequestKey_EndTimeBeforeStartTime() {
        // Arrange
        Long studentId = 1L;
        Long classroomKeyId = 1L;
        String startTime = "2023-06-01T12:00";
        String endTime = "2023-06-01T10:00";
        String purpose = "Lecture";

        // Act
        ResponseEntity<String> response = keyRequestController.requestKey(
            studentId, classroomKeyId, startTime, endTime, purpose);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("End time must be after start time", response.getBody());
    }

    @Test
    void testRequestKey_StudentNotFound() {
        // Arrange
        Long studentId = 1L;
        Long classroomKeyId = 1L;
        String startTime = "2023-06-01T10:00";
        String endTime = "2023-06-01T12:00";
        String purpose = "Lecture";
        
        when(userRepository.findById(studentId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<String> response = keyRequestController.requestKey(
            studentId, classroomKeyId, startTime, endTime, purpose);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student or classroom key not found", response.getBody());
    }

    @Test
    void testRequestKey_ClassroomKeyNotFound() {
        // Arrange
        Long studentId = 1L;
        Long classroomKeyId = 1L;
        String startTime = "2023-06-01T10:00";
        String endTime = "2023-06-01T12:00";
        String purpose = "Lecture";
        
        User student = new User();
        student.setId(studentId);
        
        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(classroomKeyRepository.findById(classroomKeyId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<String> response = keyRequestController.requestKey(
            studentId, classroomKeyId, startTime, endTime, purpose);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student or classroom key not found", response.getBody());
    }

    @Test
    void testGetKeyRequestDetails_KeyAvailable() {
        // Arrange
        Long classroomKeyId = 1L;
        ClassroomKey classroomKey = new ClassroomKey();
        classroomKey.setId(classroomKeyId);
        classroomKey.setIsAvailable(1);
        
        when(classroomKeyRepository.findById(classroomKeyId)).thenReturn(Optional.of(classroomKey));

        // Act
        ResponseEntity<?> response = keyRequestController.getKeyRequestDetails(classroomKeyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Available", ((Map<?, ?>) response.getBody()).get("keyStatus"));
    }

    @Test
    void testGetKeyRequestDetails_KeyUnavailable() {
        // Arrange
        Long classroomKeyId = 1L;
        ClassroomKey classroomKey = new ClassroomKey();
        classroomKey.setId(classroomKeyId);
        classroomKey.setIsAvailable(0);
        
        User currentHolder = new User();
        currentHolder.setId(2L);
        currentHolder.setName("Current Holder");
        currentHolder.setEmail("holder@example.com");
        
        when(classroomKeyRepository.findById(classroomKeyId)).thenReturn(Optional.of(classroomKey));
        when(borrowHistoryRepository.findCurrentHolderByClassroomKey(classroomKey))
            .thenReturn(Optional.of(currentHolder));

        // Act
        ResponseEntity<?> response = keyRequestController.getKeyRequestDetails(classroomKeyId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> responseBody = (Map<?, ?>) response.getBody();
        assertEquals("Unavailable", responseBody.get("keyStatus"));
        
        Map<?, ?> holderInfo = (Map<?, ?>) responseBody.get("currentHolder");
        assertEquals("Current Holder", holderInfo.get("name"));
    }

    @Test
    void testGetKeyRequestDetails_KeyNotFound() {
        // Arrange
        Long classroomKeyId = 1L;
        when(classroomKeyRepository.findById(classroomKeyId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = keyRequestController.getKeyRequestDetails(classroomKeyId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Classroom key not found", response.getBody());
    }

    @Test
    void testGetSentKeyRequests_Success() {
        // Arrange
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        
        KeyRequest request = new KeyRequest();
        request.setId(1L);
        request.setStatus("PENDING");
        request.setPurpose("Lecture");
        
        ClassroomKey classroomKey = new ClassroomKey();
        classroomKey.setId(1L);
        classroomKey.setBlockName("A");
        classroomKey.setClassroomName("101");
        classroomKey.setFloor("1");
        request.setClassroomKey(classroomKey);
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(keyRequestRepository.findByStudent(user)).thenReturn(Collections.singletonList(request));
        when(borrowHistoryRepository.findHolderAtRequestTime(any(), any()))
            .thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<?> response = keyRequestController.getSentKeyRequests(userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> responseBody = (List<?>) response.getBody();
        assertEquals(1, responseBody.size());
    }

    @Test
    void testGetSentKeyRequests_UserNotFound() {
        // Arrange
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = keyRequestController.getSentKeyRequests(userId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCancelKeyRequest_Success() {
        // Arrange
        Long requestId = 1L;
        KeyRequest request = new KeyRequest();
        request.setId(requestId);
        request.setStatus("PENDING");
        
        when(keyRequestRepository.findById(requestId)).thenReturn(Optional.of(request));

        // Act
        ResponseEntity<?> response = keyRequestController.cancelKeyRequest(requestId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Request cancelled successfully", 
            ((Map<?, ?>) response.getBody()).get("message"));
        assertEquals("CANCELLED", request.getStatus());
    }

    @Test
    void testCancelKeyRequest_NotFound() {
        // Arrange
        Long requestId = 1L;
        when(keyRequestRepository.findById(requestId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = keyRequestController.cancelKeyRequest(requestId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCancelKeyRequest_AlreadyProcessed() {
        // Arrange
        Long requestId = 1L;
        KeyRequest request = new KeyRequest();
        request.setId(requestId);
        request.setStatus("APPROVED");
        
        when(keyRequestRepository.findById(requestId)).thenReturn(Optional.of(request));

        // Act
        ResponseEntity<?> response = keyRequestController.cancelKeyRequest(requestId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Request cannot be canceled in its current state", 
            ((Map<?, ?>) response.getBody()).get("message"));
    }
}