package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.BorrowHistory;
import com.example.demo.repository.BorrowHistoryRepository;

@RestController
@RequestMapping("/api/history")
public class BorrowHistoryController {

    @Autowired
    private BorrowHistoryRepository borrowHistoryRepository;

    // ✅ API to get all borrowing history
    @GetMapping("/all")
    public ResponseEntity<List<BorrowHistory>> getAllBorrowHistory() {
        List<BorrowHistory> historyList = borrowHistoryRepository.findAll();
        return ResponseEntity.ok(historyList);
    }

    // ✅ API to get borrowing history for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowHistory>> getUserBorrowHistory(@PathVariable Long userId) {
        List<BorrowHistory> historyList = borrowHistoryRepository.findByStudentId(userId);
        return ResponseEntity.ok(historyList);
    }
}

