package com.example.demo.controller;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.service.AdminService;
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

class BicycleKeyAdminTest {

    @Mock
    private BicycleRepository bicycleRepository;

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
    }

    // Test cases for /addbicycle endpoint
    @Test
    void testAddBicycle_Success() {
        Bicycle bicycle = new Bicycle();
        bicycle.setId(1L);
        bicycle.setQrCode("QR123");
        bicycle.setAvailable(true);

        doNothing().when(adminService).addBicycle(any(Bicycle.class));

        ResponseEntity<?> response = adminController.addBicycle(bicycle);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody() instanceof Bicycle);
        verify(adminService, times(1)).addBicycle(any(Bicycle.class));
    }


    @Test
    void testAddBicycle_Failure() {
        Bicycle bicycle = new Bicycle();
        bicycle.setId(1L);
        bicycle.setQrCode("QR123");
        bicycle.setAvailable(true);

        doThrow(new RuntimeException("Database error")).when(adminService).addBicycle(any(Bicycle.class));

        ResponseEntity<?> response = adminController.addBicycle(bicycle);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(adminService, times(1)).addBicycle(any(Bicycle.class));
    }


    // Test cases for /bookbicycle/{bicycleId} endpoint
    @Test
    void testBookBicycle_Success() {
        Long bicycleId = 1L;
        Long userId = 1L;

        when(adminService.bookBicycle(bicycleId, userId)).thenReturn(ResponseEntity.ok("Bicycle booked successfully by user ID: " + userId));

        ResponseEntity<String> response = adminController.bookBicycle(bicycleId, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Bicycle booked successfully by user ID: " + userId, response.getBody());
        verify(adminService, times(1)).bookBicycle(bicycleId, userId);
    }

    @Test
    void testBookBicycle_Failure_BicycleNotFound() {
        Long bicycleId = 1L;
        Long userId = 1L;

        when(adminService.bookBicycle(bicycleId, userId)).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bicycle not found."));

        ResponseEntity<String> response = adminController.bookBicycle(bicycleId, userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Bicycle not found.", response.getBody());
        verify(adminService, times(1)).bookBicycle(bicycleId, userId);
    }

    @Test
    void testBookBicycle_Failure_BicycleAlreadyBooked() {
        Long bicycleId = 1L;
        Long userId = 1L;

        when(adminService.bookBicycle(bicycleId, userId)).thenReturn(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bicycle is already booked."));

        ResponseEntity<String> response = adminController.bookBicycle(bicycleId, userId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Bicycle is already booked.", response.getBody());
        verify(adminService, times(1)).bookBicycle(bicycleId, userId);
    }

    // Test cases for /available-bicycles endpoint
    @Test
    void testListAvailableBicycles_Success() {
        Bicycle bicycle1 = new Bicycle();
        bicycle1.setId(1L);
        bicycle1.setQrCode("QR123");
        bicycle1.setAvailable(true);

        Bicycle bicycle2 = new Bicycle();
        bicycle2.setId(2L);
        bicycle2.setQrCode("QR456");
        bicycle2.setAvailable(true);

        List<Bicycle> bicycles = Arrays.asList(bicycle1, bicycle2);

        when(adminService.listAvailableBicycles()).thenReturn(bicycles);

        ResponseEntity<List<Bicycle>> response = adminController.listAvailableBicycles();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(bicycles, response.getBody());
        verify(adminService, times(1)).listAvailableBicycles();
    }

    @Test
    void testListAvailableBicycles_EmptyList() {
        when(adminService.listAvailableBicycles()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Bicycle>> response = adminController.listAvailableBicycles();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(adminService, times(1)).listAvailableBicycles();
    }

    // Test cases for /all-bicycles endpoint
    @Test
    void testListAllBicycles_Success() {
        Bicycle bicycle1 = new Bicycle();
        bicycle1.setId(1L);
        bicycle1.setQrCode("QR123");
        bicycle1.setAvailable(true);

        Bicycle bicycle2 = new Bicycle();
        bicycle2.setId(2L);
        bicycle2.setQrCode("QR456");
        bicycle2.setAvailable(false);

        List<Bicycle> bicycles = Arrays.asList(bicycle1, bicycle2);

        when(adminService.listAllBicycles()).thenReturn(bicycles);

        ResponseEntity<List<Bicycle>> response = adminController.listAllBicycles();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(bicycles, response.getBody());
        verify(adminService, times(1)).listAllBicycles();
    }

    @Test
    void testListAllBicycles_EmptyList() {
        when(adminService.listAllBicycles()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Bicycle>> response = adminController.listAllBicycles();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(adminService, times(1)).listAllBicycles();
    }

    // Test cases for /recently-added-bicycle endpoint
    @Test
    void testGetRecentlyAddedCycle_Success() {
        Bicycle bicycle1 = new Bicycle();
        bicycle1.setId(1L);
        bicycle1.setQrCode("QR123");
        bicycle1.setAvailable(true);

        Bicycle bicycle2 = new Bicycle();
        bicycle2.setId(2L);
        bicycle2.setQrCode("QR456");
        bicycle2.setAvailable(true);

        List<Bicycle> bicycles = Arrays.asList(bicycle1, bicycle2);

        when(adminService.getRecentlyAddedCycle()).thenReturn(bicycles);

        ResponseEntity<List<Bicycle>> response = adminController.getRecentlyAddedCycle();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(bicycles, response.getBody());
        verify(adminService, times(1)).getRecentlyAddedCycle();
    }

    @Test
    void testGetRecentlyAddedCycle_EmptyList() {
        when(adminService.getRecentlyAddedCycle()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Bicycle>> response = adminController.getRecentlyAddedCycle();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(adminService, times(1)).getRecentlyAddedCycle();
    }

    // Test cases for /bicycle-history endpoint
    @Test
    void testGetAllBicycleHistory_Success() {
        BorrowHistory history1 = new BorrowHistory();
        history1.setId(1L);

        BorrowHistory history2 = new BorrowHistory();
        history2.setId(2L);

        List<BorrowHistory> histories = Arrays.asList(history1, history2);

        when(adminService.getAllBicycleHistory()).thenReturn(histories);

        ResponseEntity<List<BorrowHistory>> response = adminController.getAllBicycleHistory();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(histories, response.getBody());
        verify(adminService, times(1)).getAllBicycleHistory();
    }

    @Test
    void testGetAllBicycleHistory_EmptyList() {
        when(adminService.getAllBicycleHistory()).thenReturn(Collections.emptyList());

        ResponseEntity<List<BorrowHistory>> response = adminController.getAllBicycleHistory();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(adminService, times(1)).getAllBicycleHistory();
    }

    // Test cases for /borrowed-bicycles endpoint
    @Test
    void testGetCurrentlyBorrowedBicycles_Success() {
        BorrowHistory history1 = new BorrowHistory();
        history1.setId(1L);

        BorrowHistory history2 = new BorrowHistory();
        history2.setId(2L);

        List<BorrowHistory> histories = Arrays.asList(history1, history2);

        when(adminService.getCurrentlyBorrowedBicycles()).thenReturn(histories);

        ResponseEntity<List<BorrowHistory>> response = adminController.getCurrentlyBorrowedBicycles();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(histories, response.getBody());
        verify(adminService, times(1)).getCurrentlyBorrowedBicycles();
    }

    @Test
    void testGetCurrentlyBorrowedBicycles_EmptyList() {
        when(adminService.getCurrentlyBorrowedBicycles()).thenReturn(Collections.emptyList());

        ResponseEntity<List<BorrowHistory>> response = adminController.getCurrentlyBorrowedBicycles();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(adminService, times(1)).getCurrentlyBorrowedBicycles();
    }

    // Test cases for /mark-bicycle-borrowed/{bicycleId} endpoint
    @Test
    void testMarkBicycleAsBorrowed_Success() {
        Long bicycleId = 1L;
        Bicycle bicycle = new Bicycle();
        bicycle.setId(bicycleId);
        bicycle.setAvailable(true);

        when(bicycleRepository.findById(bicycleId)).thenReturn(Optional.of(bicycle));

        ResponseEntity<?> response = adminController.markBicycleAsBorrowed(bicycleId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Bicycle marked as borrowed successfully", response.getBody());
        verify(bicycleRepository, times(1)).findById(bicycleId);
        verify(bicycleRepository, times(1)).save(bicycle);
    }

    @Test
    void testMarkBicycleAsBorrowed_Failure_BicycleNotFound() {
        Long bicycleId = 1L;

        when(bicycleRepository.findById(bicycleId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = adminController.markBicycleAsBorrowed(bicycleId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Bicycle not found", response.getBody());
        verify(bicycleRepository, times(1)).findById(bicycleId);
        verify(bicycleRepository, never()).save(any());
    }

    @Test
    void testMarkBicycleAsBorrowed_Failure_InternalServerError() {
        Long bicycleId = 1L;

        when(bicycleRepository.findById(bicycleId)).thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> response = adminController.markBicycleAsBorrowed(bicycleId);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error marking bicycle as borrowed", response.getBody());
        verify(bicycleRepository, times(1)).findById(bicycleId);
        verify(bicycleRepository, never()).save(any());
    }

    // Test cases for /mark-bicycle-available/{bicycleId} endpoint
    @Test
    void testMarkBicycleAsAvailable_Success() {
        Long bicycleId = 1L;
        Bicycle bicycle = new Bicycle();
        bicycle.setId(bicycleId);
        bicycle.setAvailable(false);

        when(bicycleRepository.findById(bicycleId)).thenReturn(Optional.of(bicycle));

        ResponseEntity<?> response = adminController.markBicycleAsAvailable(bicycleId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Bicycle marked as available successfully", response.getBody());
        verify(bicycleRepository, times(1)).findById(bicycleId);
        verify(bicycleRepository, times(1)).save(bicycle);
    }

    @Test
    void testMarkBicycleAsAvailable_Failure_BicycleNotFound() {
        Long bicycleId = 1L;

        when(bicycleRepository.findById(bicycleId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = adminController.markBicycleAsAvailable(bicycleId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Bicycle not found", response.getBody());
        verify(bicycleRepository, times(1)).findById(bicycleId);
        verify(bicycleRepository, never()).save(any());
    }

    @Test
    void testMarkBicycleAsAvailable_Failure_InternalServerError() {
        Long bicycleId = 1L;

        when(bicycleRepository.findById(bicycleId)).thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> response = adminController.markBicycleAsAvailable(bicycleId);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error marking bicycle as available", response.getBody());
        verify(bicycleRepository, times(1)).findById(bicycleId);
        verify(bicycleRepository, never()).save(any());
    }

    // Test cases for /delete-bicycle/{bicycleId} endpoint
    @Test
    void testDeleteBicycle_Success() {
        Long bicycleId = 1L;

        doNothing().when(bicycleRepository).deleteById(bicycleId);

        ResponseEntity<?> response = adminController.deleteBicycle(bicycleId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Bicycle deleted successfully", response.getBody());
        verify(bicycleRepository, times(1)).deleteById(bicycleId);
    }

    @Test
    void testDeleteBicycle_Failure_InternalServerError() {
        Long bicycleId = 1L;

        doThrow(new RuntimeException("Database error")).when(bicycleRepository).deleteById(bicycleId);

        ResponseEntity<?> response = adminController.deleteBicycle(bicycleId);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error deleting bicycle", response.getBody());
        verify(bicycleRepository, times(1)).deleteById(bicycleId);
    }
}