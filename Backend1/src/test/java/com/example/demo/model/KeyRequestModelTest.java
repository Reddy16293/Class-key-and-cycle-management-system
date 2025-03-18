package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.sql.Timestamp;

public class KeyRequestModelTest {

    @Test
    public void testKeyRequestModel() {
        KeyRequest request = new KeyRequest();
        request.setId(1L);
        request.setRequestTime(new Timestamp(System.currentTimeMillis()));
        request.setStatus("PENDING");

        assertEquals(1L, request.getId());
        assertNotNull(request.getRequestTime());
        assertEquals("PENDING", request.getStatus());
    }
}