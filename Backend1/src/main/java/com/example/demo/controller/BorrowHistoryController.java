package com.example.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
import org.springframework.web.bind.annotation.RequestParam;
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
    
    @PostMapping("/return-with-feedback/{borrowId}")
    public ResponseEntity<String> returnWithFeedback(
            @PathVariable Long borrowId,
            @RequestParam(required = false) String feedback,
            @RequestParam(required = false) String conditionDescription,
            @RequestParam(required = false) Integer experienceRating) {
        
        BorrowHistory history = borrowHistoryRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));
        
        // Only process feedback if this is a bicycle rental
        if (history.getBicycle() != null) {
            history.setFeedback(feedback);
            history.setConditionDescription(conditionDescription);
            history.setExperienceRating(experienceRating);
            
            // Update bicycle availability
            Bicycle bicycle = history.getBicycle();
            bicycle.setAvailable(true);
            bicycleRepository.save(bicycle); // Save the updated bicycle status
        }
        
        // Mark as returned
        history.setReturnTime(new Timestamp(System.currentTimeMillis()));
        history.setIsReturned(true);
        
        borrowHistoryRepository.save(history);
        
        return ResponseEntity.ok("Item returned successfully with feedback");
    }    
    

    // ✅ API to get all borrowing history
    @GetMapping("/all")
    public ResponseEntity<List<BorrowHistory>> getAllBorrowHistory() {
        List<BorrowHistory> historyList = borrowHistoryRepository.findAll();
        return ResponseEntity.ok(historyList);
    }

    // ✅ API to get borrowing history for a specific user (both bicycles and keys)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowHistory>> getUserBorrowHistory(@PathVariable Long userId) {
        List<BorrowHistory> historyList = borrowHistoryRepository.findByStudentId(userId);
        return ResponseEntity.ok(historyList);
    }
    
    // ✅ Get user's bicycle borrow history only
    @GetMapping("/user/{userId}/bicycles")
    public ResponseEntity<List<BorrowHistory>> getUserBicycleHistory(@PathVariable Long userId) {
        List<BorrowHistory> bicycleHistory = borrowHistoryRepository.findByStudentIdAndBicycleIsNotNull(userId);
        return ResponseEntity.ok(bicycleHistory);
    }

    // ✅ Get user's classroom key borrow history only
    @GetMapping("/user/{userId}/classroom-keys")
    public ResponseEntity<List<BorrowHistory>> getUserClassroomKeyHistory(@PathVariable Long userId) {
        List<BorrowHistory> keyHistory = borrowHistoryRepository.findByStudentIdAndClassroomKeyIsNotNull(userId);
        return ResponseEntity.ok(keyHistory);
    }
    
    @GetMapping("/user/{userId}/active-borrowings")
    public ResponseEntity<List<BorrowHistory>> getActiveBorrowings(@PathVariable Long userId) {
        List<BorrowHistory> activeBorrowings = borrowHistoryRepository.findByStudentIdAndIsReturnedFalse(userId);
        return ResponseEntity.ok(activeBorrowings);
    }

    // ✅ Active bicycle borrowings only
    @GetMapping("/user/{userId}/active-bicycles")
    public ResponseEntity<List<BorrowHistory>> getActiveBicycleBorrowings(@PathVariable Long userId) {
        List<BorrowHistory> activeBicycles = borrowHistoryRepository.findByStudentIdAndBicycleIsNotNullAndIsReturnedFalse(userId);
        return ResponseEntity.ok(activeBicycles);
    }

    // ✅ Active classroom key borrowings only
    @GetMapping("/user/{userId}/active-keys")
    public ResponseEntity<List<BorrowHistory>> getActiveKeyBorrowings(@PathVariable Long userId) {
        List<BorrowHistory> activeKeys = borrowHistoryRepository.findByStudentIdAndClassroomKeyIsNotNullAndIsReturnedFalse(userId);
        return ResponseEntity.ok(activeKeys);
    }

    // ✅ All bicycle borrow history
    @GetMapping("/bicycles")
    public ResponseEntity<List<BorrowHistory>> getAllBicycleHistory() {
        List<BorrowHistory> bicycleHistory = borrowHistoryRepository.findByBicycleIsNotNull();
        return ResponseEntity.ok(bicycleHistory);
    }

    // ✅ All classroom key borrow history
    @GetMapping("/classroom-keys")
    public ResponseEntity<List<BorrowHistory>> getAllClassroomKeyHistory() {
        List<BorrowHistory> keyHistory = borrowHistoryRepository.findByClassroomKeyIsNotNull();
        return ResponseEntity.ok(keyHistory);
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