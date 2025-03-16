package com.example.demo.controller;

import com.example.demo.model.Bicycle;
import com.example.demo.model.ClassroomKey;
import com.example.demo.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    // ✅ Valid Test: Add Bicycle (Should Pass)
    @Test
    void testAddBicycle_Valid() throws Exception {
        doNothing().when(adminService).addBicycle(any(Bicycle.class));

        mockMvc.perform(post("/api/admin/addbicycle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"qrCode\":\"QR1234\",\"available\":true}"))
                .andExpect(status().isCreated());
    }

    // ❌ Fail: Wrong Expected Status Code
    @Test
    void testAddBicycle_WrongExpectedStatus() throws Exception {
        doNothing().when(adminService).addBicycle(any(Bicycle.class));

        mockMvc.perform(post("/api/admin/addbicycle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"qrCode\":\"QR1234\",\"available\":true}"))
                .andExpect(status().isBadRequest()); // ❌ Expected 400, but actual is 201
    }

    // ❌ Fail: Wrong JSON Field Name
    @Test
    void testAddBicycle_WrongJsonField() throws Exception {
        doNothing().when(adminService).addBicycle(any(Bicycle.class));

        mockMvc.perform(post("/api/admin/addbicycle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"qr_code\":\"QR1234\",\"isAvailable\":true}")) // ❌ Wrong field names
                .andExpect(status().isCreated());
    }

    // ❌ Fail: Missing Required Field
    @Test
    void testAddBicycle_MissingRequiredField() throws Exception {
        doNothing().when(adminService).addBicycle(any(Bicycle.class));

        mockMvc.perform(post("/api/admin/addbicycle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"qrCode\":\"QR1234\"}")) // ❌ Missing "available"
                .andExpect(status().isCreated());
    }

    // ❌ Fail: Unexpected Response Content
    @Test
    void testAddBicycle_WrongResponseContent() throws Exception {
        doNothing().when(adminService).addBicycle(any(Bicycle.class));

        mockMvc.perform(post("/api/admin/addbicycle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"qrCode\":\"QR1234\",\"available\":true}"))
                .andExpect(status().isCreated())
                .andExpect(content().string("Bicycle added successfully")); // ❌ Wrong expected response body
    }

    // ❌ Fail: No Service Mocking (Causes NullPointerException)
    @Test
    void testAddBicycle_NoMocking() throws Exception {
        mockMvc.perform(post("/api/admin/addbicycle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"qrCode\":\"QR1234\",\"available\":true}"))
                .andExpect(status().isCreated()); // ❌ This will fail due to NullPointerException
    }
}
