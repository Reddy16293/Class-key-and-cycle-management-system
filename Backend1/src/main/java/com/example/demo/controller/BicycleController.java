package com.example.demo.controller;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.User;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.web.server.ResponseStatusException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api/bicycles")
public class BicycleController {

    @Autowired
    private BicycleRepository bicycleRepository;
    @Autowired
    private BorrowHistoryRepository borrowHistoryRepository;
    @Autowired
    private UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(BicycleController.class);
    @PostMapping("/book-by-qr")
    @Transactional
    public ResponseEntity<String> bookBicycleByQr(
        @RequestParam String qrCode, 
        @RequestParam Long userId) {
        
        logger.info("Booking bicycle with QR code {} for user {}", qrCode, userId);
        
        try {
            // Find bicycle
            Bicycle bicycle = bicycleRepository.findByQrCode(qrCode)
                .orElseThrow(() -> {
                    logger.error("Bicycle not found with QR code: {}", qrCode);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Bicycle not found");
                });
            
            // Find user
            User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
            
            if (!bicycle.getIsAvailable()) {
                logger.warn("Bicycle {} is not available", qrCode);
                return ResponseEntity.badRequest().body("Bicycle is not available");
            }
            
            // Update bicycle status
            bicycle.setAvailable(false);
            bicycleRepository.save(bicycle);
            logger.info("Bicycle {} status updated to unavailable", qrCode);
            
            // Create and save borrow history
            BorrowHistory history = new BorrowHistory();
            history.setStudent(user);
            history.setBicycle(bicycle);
            history.setBorrowTime(new Timestamp(System.currentTimeMillis()));
            history.setIsReturned(false);
            borrowHistoryRepository.save(history);
            logger.info("Borrow history created for bicycle {} and user {}", qrCode, userId);
            
            return ResponseEntity.ok("Bicycle booked successfully");
        } catch (Exception e) {
            logger.error("Error booking bicycle: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing booking");
        }
    }
    // Book a bicycle
    @PostMapping("/book/{bicycleId}")
    public ResponseEntity<String> bookBicycle(@PathVariable Long bicycleId, @RequestParam Long userId) {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.info("Booking bicycle with ID {} for user {}", bicycleId, userId);

        try {
            // Find bicycle
            Bicycle bicycle = bicycleRepository.findById(bicycleId)
                .orElseThrow(() -> {
                    logger.error("Bicycle not found with ID: {}", bicycleId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Bicycle not found");
                });

            // Find user
            User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });

            if (!bicycle.getIsAvailable()) {
                logger.warn("Bicycle {} is not available", bicycleId);
                return ResponseEntity.badRequest().body("Bicycle is not available");
            }

            // Update bicycle status
            bicycle.setAvailable(false);
            bicycleRepository.save(bicycle);
            logger.info("Bicycle {} status updated to unavailable", bicycleId);

            // Create and save borrow history
            BorrowHistory history = new BorrowHistory();
            history.setStudent(user);
            history.setBicycle(bicycle);
            history.setBorrowTime(new Timestamp(System.currentTimeMillis()));
            history.setIsReturned(false);
            borrowHistoryRepository.save(history);
            logger.info("Borrow history created for bicycle {} and user {}", bicycleId, userId);

            return ResponseEntity.ok("Bicycle booked successfully");
        } catch (Exception e) {
            logger.error("Error booking bicycle: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing booking");
        }
    }

    // Get all available bicycles
    @GetMapping("/available")
    public ResponseEntity<List<Bicycle>> listAvailableBicycles() {
        List<Bicycle> bicycles = bicycleRepository.findByIsAvailable(true);
        return ResponseEntity.ok(bicycles);
    }

    // Get all bicycles (available and unavailable)
    @GetMapping("/all")
    public ResponseEntity<List<Bicycle>> listAllBicycles() {
        List<Bicycle> bicycles = bicycleRepository.findAll();
        return ResponseEntity.ok(bicycles);
    }

    // Get available bicycles at a specific location
    @GetMapping("/available-at-location")
    public ResponseEntity<List<Bicycle>> getAvailableBicyclesAtLocation(@RequestParam String location) {
        List<Bicycle> bicycles = bicycleRepository.findByLocationAndIsAvailable(location, true);
        return ResponseEntity.ok(bicycles);
    }

    // Get all bicycles at a specific location (available and unavailable)
    @GetMapping("/at-location")
    public ResponseEntity<List<Bicycle>> getBicyclesAtLocation(@RequestParam String location) {
        List<Bicycle> bicycles = bicycleRepository.findByLocation(location);
        return ResponseEntity.ok(bicycles);
    }

    // Add a new bicycle
    @PostMapping("/add")
    public ResponseEntity<Bicycle> addBicycle(@RequestBody Bicycle bicycle) {
        if (bicycleRepository.existsByQrCode(bicycle.getQrCode())) {
            return ResponseEntity.badRequest().build();
        }
        Bicycle savedBicycle = bicycleRepository.save(bicycle);
        return ResponseEntity.ok(savedBicycle);
    }

    // Update bicycle availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<Bicycle> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean available) {
        return bicycleRepository.findById(id)
                .map(bicycle -> {
                    bicycle.setAvailable(available);
                    Bicycle updatedBicycle = bicycleRepository.save(bicycle);
                    return ResponseEntity.ok(updatedBicycle);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}