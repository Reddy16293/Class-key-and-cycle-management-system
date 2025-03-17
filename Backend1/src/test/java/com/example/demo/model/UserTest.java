package com.example.demo.model;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class UserTest {

    @Test
    public void testUserModel() {
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setEmail("john.doe@example.com");
        user.setUserName("johndoe");
        user.setPicture("profile.jpg");
        user.setRole("ADMIN");
        user.setPassword("password123");
       

        assertEquals(1L, user.getId());
        assertEquals("John Doe", user.getName());
        assertEquals("john.doe@example.com", user.getEmail());
        assertEquals("johndoe", user.getUserName());
        assertEquals("profile.jpg", user.getPicture());
        assertEquals("ADMIN", user.getRole());
        assertEquals("password123", user.getPassword());
        
    }
}