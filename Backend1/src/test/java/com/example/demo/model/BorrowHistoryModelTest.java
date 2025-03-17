package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.sql.Timestamp;

public class BorrowHistoryModelTest {

    @Test
    public void testBorrowHistoryModel() {
        BorrowHistory history = new BorrowHistory();
        history.setId(1L);
        history.setBorrowTime(new Timestamp(System.currentTimeMillis()));
        history.setReturnTime(new Timestamp(System.currentTimeMillis()));
        history.setFeedback("Good condition");

        assertEquals(1L, history.getId());
        assertNotNull(history.getBorrowTime());
        assertNotNull(history.getReturnTime());
        assertEquals("Good condition", history.getFeedback());
    }
}