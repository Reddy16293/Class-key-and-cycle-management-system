package com.example.demo.controller;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.StudentService;

import jakarta.servlet.http.HttpServletRequest;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {
	 private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    @Autowired
    private StudentService studentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BicycleRepository bicycleRepository;
    @Autowired
    private ClassroomKeyRepository classroomKeyRepository;
    @Autowired
    private BorrowHistoryRepository borrowHistoryRepository;
    
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

   

    

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User student) {
        return studentService.signup(student);
    }

   
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User student) {
        return studentService.login(student);
    }

    @PostMapping("/book-classroom-key/{keyId}")
    public ResponseEntity<String> bookClassroomKey(
            @PathVariable Long keyId,
            @RequestParam Long userId,
            HttpServletRequest request) { // Add HttpServletRequest to inspect the request
        logger.info("Received request to book classroom key {} for user {}", keyId, userId);
        logger.info("Request headers: {}", request.getHeaderNames());
        logger.info("Request cookies: {}", request.getCookies());

        Optional<ClassroomKey> keyOptional = classroomKeyRepository.findById(keyId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (keyOptional.isEmpty() || userOptional.isEmpty()) {
            logger.error("Invalid key or user ID: keyId={}, userId={}", keyId, userId);
            return ResponseEntity.badRequest().body("Invalid key or user ID");
        }

        ClassroomKey key = keyOptional.get();
        User user = userOptional.get();

        if (key.getIsAvailable() == 0) {
            logger.warn("Key {} is already borrowed", keyId);
            return ResponseEntity.badRequest().body("Key is already borrowed");
        }

        // Mark the key as borrowed
        key.setIsAvailable(0);
        classroomKeyRepository.save(key);
        logger.info("Key {} marked as borrowed", keyId);

        // Save borrow history
        BorrowHistory history = new BorrowHistory();
        history.setStudent(user);
        history.setClassroomKey(key);
        history.setBorrowTime(new Timestamp(System.currentTimeMillis()));
        borrowHistoryRepository.save(history);
        logger.info("Borrow history saved successfully!");

        return ResponseEntity.ok("Key successfully booked by " + user.getName());
    }
    
    
    @GetMapping("/available-rooms/{blockName}/{floor}")
    public ResponseEntity<List<ClassroomKey>> getAvailableRooms(
            @PathVariable String blockName, @PathVariable String floor) {
        List<ClassroomKey> availableRooms = classroomKeyRepository
            .findByBlockNameAndFloorAndIsAvailable(blockName, floor, 1);

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)  // ✅ Ensure JSON response
            .body(availableRooms);
    }


    @GetMapping("/check-key-availability/{keyId}")
    public ResponseEntity<Integer> checkKeyAvailability(@PathVariable Long keyId) {
        Optional<ClassroomKey> keyOptional = classroomKeyRepository.findById(keyId);
        if (keyOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(0); // Key not found
        }
        return ResponseEntity.ok(keyOptional.get().getIsAvailable());
    }
    // Endpoint to check key availability for all available rooms
    @GetMapping("/available-rooms")
    public ResponseEntity<List<Map<String, Object>>> getAvailableRooms() {
        return studentService.getAvailableRooms();
    }
    
    // New API Endpoints for Bicycle Management
    
    @PostMapping("/bookbicycle/{bicycleId}")
    public ResponseEntity<String> bookBicycle(@PathVariable Long bicycleId, @RequestParam Long userId) {
        return studentService.bookBicycle(bicycleId, userId);
    }

    @GetMapping("/available-bicycles")
    public ResponseEntity<List<Bicycle>> listAvailableBicycles() {
        List<Bicycle> bicycles = studentService.listAvailableBicycles();
        return ResponseEntity.ok(bicycles);
    }

    @GetMapping("/all-bicycles")
    public ResponseEntity<List<Bicycle>> listAllBicycles() {
        List<Bicycle> bicycles = studentService.listAllBicycles();
        return ResponseEntity.ok(bicycles);
    }
}