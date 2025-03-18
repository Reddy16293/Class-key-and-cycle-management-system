package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class BicycleModelTest {

    @Test
    public void testBicycleModel() {
        Bicycle bicycle = new Bicycle();
        bicycle.setId(1L);
        bicycle.setQrCode("QR123");
        bicycle.setAvailable(true);

        assertEquals(1L, bicycle.getId());
        assertEquals("QR123", bicycle.getQrCode());
        assertTrue(bicycle.getIsAvailable());
    }
}