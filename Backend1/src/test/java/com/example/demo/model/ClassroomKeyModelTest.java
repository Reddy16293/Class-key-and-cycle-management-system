package com.example.demo.model;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class ClassroomKeyModelTest {

    @Test
    public void testClassroomKeyModel() {
        ClassroomKey key = new ClassroomKey();
        key.setId(1L);
        key.setClassroomName("Room 101");
        key.setBlockName("Block A");
        key.setIsAvailable(1);

        assertEquals(1L, key.getId());
        assertEquals("Room 101", key.getClassroomName());
        assertEquals("Block A", key.getBlockName());
        assertEquals(1, key.getIsAvailable());
    }
}