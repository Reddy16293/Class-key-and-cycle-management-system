package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.example.demo.imp.StudentServiceImpl;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BicycleRepository bicycleRepository;

    @Mock
    private ClassroomKeyRepository classroomKeyRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    @Test
    public void testBookClassroomKey() {
        User user = new User();
        ClassroomKey key = new ClassroomKey();
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(classroomKeyRepository.findById(anyLong())).thenReturn(Optional.of(key));

        ResponseEntity<String> response = studentService.bookClassroomKey(1L, 1L);
        assertEquals("Key successfully booked by " + user.getName(), response.getBody());
    }
}