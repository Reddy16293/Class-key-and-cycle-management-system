package com.example.demo.integration;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.model.ClassroomKey;
import com.example.demo.service.AdminService;

@SpringBootTest
public class AdminIntegrationTest {

    @Autowired
    private AdminService adminService;

    @Test
    public void testAddClassroom() {
        ClassroomKey key = new ClassroomKey();
        key.setClassroomName("Room 101");
        key.setBlockName("Block A");

        adminService.addClassroom(key);
        assertNotNull(key.getId());
    }
}