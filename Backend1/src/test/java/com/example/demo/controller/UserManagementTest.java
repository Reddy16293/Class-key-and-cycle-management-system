package com.example.demo.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.demo.controller.AdminController;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class UserManagementTest {

    @InjectMocks
    private AdminController adminController;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * ✅ Success: Change user role from NON_CR to CR
     */
    @Test
    void testChangeUserRole_Success_NonCRtoCR() {
        User user = new User();
        user.setId(1L);
        user.setName("John");
        user.setRole("NON_CR");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = adminController.changeUserRole(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User role updated to CR", response.getBody());
    }

    /**
     * ✅ Success: Change user role from CR to NON_CR
     */
    @Test
    void testChangeUserRole_Success_CRtoNonCR() {
        User user = new User();
        user.setId(2L);
        user.setName("Alice");
        user.setRole("CR");

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = adminController.changeUserRole(2L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User role updated to NON_CR", response.getBody());
    }

    /**
     * ❌ Failure: User not found
     */
    @Test
    void testChangeUserRole_Fail_UserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = adminController.changeUserRole(99L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    /**
     * ❌ Failure: Invalid role change (ADMIN role should not be changed)
     */
    @Test
    void testChangeUserRole_Fail_InvalidRole() {
        User user = new User();
        user.setId(3L);
        user.setName("Mark");
        user.setRole("ADMIN"); // ADMIN should not be changed

        when(userRepository.findById(3L)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = adminController.changeUserRole(3L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid role change", response.getBody());
    }

    /**
     * ✅ Success: Fetch all users
     */
    @Test
    void testGetAllUsers_Success() {
        User user1 = new User();
        user1.setId(1L);
        user1.setName("John");
        user1.setRole("CR");

        User user2 = new User();
        user2.setId(2L);
        user2.setName("Alice");
        user2.setRole("NON_CR");

        List<User> users = Arrays.asList(user1, user2);
        when(userRepository.findAll()).thenReturn(users);

        ResponseEntity<List<User>> response = adminController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }
     
    
    /**
     * ❌ Failure: No users in the database (returns empty list)
     */
    @Test
    void testGetAllUsers_Fail_NoUsersFound() {
        when(userRepository.findAll()).thenReturn(Arrays.asList()); // Return an empty list

        ResponseEntity<List<User>> response = adminController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty()); // Ensure the list is empty
    }

    /**
     * ✅ Success: Delete user
     */
    @Test
    void testDeleteUser_Success() {
        doNothing().when(userRepository).deleteById(1L);

        ResponseEntity<?> response = adminController.deleteUser(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deleted successfully", response.getBody());
    }

    /**
     * ❌ Failure: Error while deleting user (Database issue)
     */
    @Test
    void testDeleteUser_Fail_DatabaseError() {
        doThrow(new RuntimeException("Database error")).when(userRepository).deleteById(2L);

        ResponseEntity<?> response = adminController.deleteUser(2L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error deleting user", response.getBody());
    }
}
