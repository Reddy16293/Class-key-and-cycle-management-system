package com.example.demo.service;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.demo.imp.AdminServiceImpl;
import com.example.demo.model.ClassroomKey;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BicycleRepository bicycleRepository;

    @Mock
    private ClassroomKeyRepository classroomKeyRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    public void testAddClassroom() {
        ClassroomKey key = new ClassroomKey();
        when(classroomKeyRepository.save(any(ClassroomKey.class))).thenReturn(key);

        adminService.addClassroom(key);
        verify(classroomKeyRepository, times(1)).save(key);
    }
}