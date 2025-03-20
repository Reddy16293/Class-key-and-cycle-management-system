package com.example.demo.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.KeyRequestRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/history")
public class BorrowHistoryController {

    @Autowired
    private BorrowHistoryRepository borrowHistoryRepository;
    
    @Autowired
    private KeyRequestRepository keyRequestRepository;

    @Autowired
    private ClassroomKeyRepository classroomKeyRepository;

    @Autowired
    private BicycleRepository bicycleRepository;

    @Autowired
    private UserRepository userRepository;
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
    
    @GetMapping("/user/{userId}/active-borrowings")
    public ResponseEntity<List<BorrowHistory>> getActiveBorrowings(@PathVariable Long userId) {
        List<BorrowHistory> activeBorrowings = borrowHistoryRepository.findByStudentIdAndIsReturnedFalse(userId);
        return ResponseEntity.ok(activeBorrowings);
    }
    
    @PostMapping("/return/{borrowId}")
    public ResponseEntity<String> returnItem(@PathVariable Long borrowId) {
        Optional<BorrowHistory> borrowHistoryOpt = borrowHistoryRepository.findById(borrowId);

        if (borrowHistoryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Borrow record not found");
        }

        BorrowHistory borrowHistory = borrowHistoryOpt.get();

        // Check if the item is already returned
        if (borrowHistory.getIsReturned()) {
            return ResponseEntity.badRequest().body("Item is already returned");
        }

        // Update BorrowHistory
        borrowHistory.setIsReturned(true);
        borrowHistory.setReturnTime(new Timestamp(System.currentTimeMillis()));
        borrowHistoryRepository.save(borrowHistory);

        // Update ClassroomKey or Bicycle availability
        if (borrowHistory.getClassroomKey() != null) {
            ClassroomKey classroomKey = borrowHistory.getClassroomKey();
            classroomKey.setIsAvailable(1);
            classroomKeyRepository.save(classroomKey);
        } else if (borrowHistory.getBicycle() != null) {
            Bicycle bicycle = borrowHistory.getBicycle();
            bicycle.setAvailable(true);
            bicycleRepository.save(bicycle);
        }

        return ResponseEntity.ok("Item returned successfully");
    }
}

