package com.example.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.BorrowHistory;
import com.example.demo.repository.BorrowHistoryRepository;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final BorrowHistoryRepository borrowHistoryRepository;

    public FeedbackController(BorrowHistoryRepository borrowHistoryRepository) {
        this.borrowHistoryRepository = borrowHistoryRepository;
    }

    @GetMapping("/bicycle/{bicycleId}")
    public ResponseEntity<List<BorrowHistory>> getFeedbackForBicycle(
            @PathVariable Long bicycleId) {
        
        List<BorrowHistory> feedbackList = borrowHistoryRepository
                .findByBicycleIdAndConditionDescriptionNotNullOrderByBorrowTimeDesc(bicycleId);
        
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("/borrow/{borrowId}")
    public ResponseEntity<BorrowHistory> getFeedbackForBorrowRecord(
            @PathVariable Long borrowId) {
        
        BorrowHistory history = borrowHistoryRepository
                .findBicycleFeedbackByBorrowId(borrowId);
        
        if (history == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(history);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<BorrowHistory>> getFeedbackByUser(
            @PathVariable Long userId,
            Pageable pageable) {
        
        Page<BorrowHistory> feedbackPage = borrowHistoryRepository
                .findByStudent_IdAndBicycleIsNotNullAndConditionDescriptionIsNotNull(
                    userId, pageable);
        
        return ResponseEntity.ok(feedbackPage);
    }

    @GetMapping("/bicycles")
    public ResponseEntity<Page<BorrowHistory>> getAllBicycleFeedback(
            Pageable pageable) {
        
        Page<BorrowHistory> feedbackPage = borrowHistoryRepository
                .findByBicycleIsNotNullAndConditionDescriptionIsNotNull(pageable);
        
        return ResponseEntity.ok(feedbackPage);
    }
}
