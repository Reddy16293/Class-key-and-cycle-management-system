/*
package com.example.demo.controller;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.example.demo.model.ClassroomKey;
import com.example.demo.service.AdminService;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @Test
    public void testAddClassroom() {
        ClassroomKey key = new ClassroomKey();
        
        // Mock the void method
        doNothing().when(adminService).addClassroom(any(ClassroomKey.class));

        ResponseEntity<String> response = adminController.addClassroom(key);
        
        // Verify the response
        assertEquals("Classroom added successfully", response.getBody());
        
        // Verify that the service method was called
        verify(adminService, times(1)).addClassroom(any(ClassroomKey.class));
    }
    
    @Test
    public void testAddClassroom_ThrowsException() {
        ClassroomKey key = new ClassroomKey();
        
        // Mock the void method to throw an exception
        doThrow(new RuntimeException("Database error")).when(adminService).addClassroom(any(ClassroomKey.class));

        // Call the controller method and expect an exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            adminController.addClassroom(key);
        });

        // Verify the exception message
        assertEquals("Database error", exception.getMessage());
        
        // Verify that the service method was called
        verify(adminService, times(1)).addClassroom(any(ClassroomKey.class));
    }
} */