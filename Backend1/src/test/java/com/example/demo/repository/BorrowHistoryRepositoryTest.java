package com.example.demo.repository;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.demo.model.BorrowHistory;

import java.util.List;

@DataJpaTest
public class BorrowHistoryRepositoryTest {

    @Autowired
    private BorrowHistoryRepository borrowHistoryRepository;

    @Test
    public void testFindByBicycleIsNull() {
        BorrowHistory history = new BorrowHistory();
        borrowHistoryRepository.save(history);

        List<BorrowHistory> keyHistory = borrowHistoryRepository.findByBicycleIsNull();
        assertFalse(keyHistory.isEmpty());
    }
}