package com.example.demo.integration;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.example.demo.service.StudentService;

@SpringBootTest
public class StudentIntegrationTest {

    @Autowired
    private StudentService studentService;

    @Test
    public void testBookClassroomKey() {
        ResponseEntity<String> response = studentService.bookClassroomKey(1L, 1L);
        assertEquals("Key successfully booked by John Doe", response.getBody());
    }
}