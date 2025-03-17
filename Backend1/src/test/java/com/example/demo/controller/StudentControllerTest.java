package com.example.demo.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.example.demo.service.StudentService;

@ExtendWith(MockitoExtension.class)
public class StudentControllerTest {

    @Mock
    private StudentService studentService;

    @InjectMocks
    private StudentController studentController;

    @Test
    public void testBookClassroomKey() {
        when(studentService.bookClassroomKey(anyLong(), anyLong())).thenReturn(ResponseEntity.ok("Key successfully booked by John Doe"));

        ResponseEntity<String> response = studentController.bookClassroomKey(1L, 1L);
        assertEquals("Key successfully booked by John Doe", response.getBody());
    }
}