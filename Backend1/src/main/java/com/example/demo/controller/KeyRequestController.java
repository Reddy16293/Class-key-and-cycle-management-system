package com.example.demo.controller;

import com.example.demo.model.KeyRequest;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.KeyRequestRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/key-requests")
public class KeyRequestController {

    @Autowired
    private KeyRequestRepository keyRequestRepository;

    @Autowired
    private ClassroomKeyRepository classroomKeyRepository;

    @Autowired
    private UserRepository userRepository;

    // API to request a key from one classroom to another
    @PostMapping("/request")
    public ResponseEntity<String> requestKey(
            @RequestParam Long studentId,
            @RequestParam Long classroomKeyId) {

        // Fetch the student (requester)
        Optional<User> studentOptional = userRepository.findById(studentId);
        if (studentOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Student not found");
        }
        User student = studentOptional.get();

        // Fetch the classroom key
        Optional<ClassroomKey> classroomKeyOptional = classroomKeyRepository.findById(classroomKeyId);
        if (classroomKeyOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Classroom key not found");
        }
        ClassroomKey classroomKey = classroomKeyOptional.get();

        // Check if the key is already unavailable
        // if (classroomKey.getIsAvailable() == 0) {
           // return ResponseEntity.badRequest().body("Key is already unavailable");
        //}

        // Create a new key request
        KeyRequest keyRequest = new KeyRequest();
        keyRequest.setStudent(student);
        keyRequest.setClassroomKey(classroomKey);
        keyRequest.setRequestTime(Timestamp.from(Instant.now())); // Set current time
        keyRequest.setStatus("PENDING"); // Default status

        // Save the key request
        keyRequestRepository.save(keyRequest);

        return ResponseEntity.ok("Key request submitted successfully");
    }
    
    @GetMapping("/request-details/{classroomKeyId}")
    public ResponseEntity<?> getKeyRequestDetails(@PathVariable Long classroomKeyId) {
        // Fetch the classroom key
        Optional<ClassroomKey> classroomKeyOptional = classroomKeyRepository.findById(classroomKeyId);
        if (classroomKeyOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Classroom key not found");
        }
        ClassroomKey classroomKey = classroomKeyOptional.get();

        // Fetch the key request for this classroom key
        Optional<KeyRequest> keyRequestOptional = keyRequestRepository.findByClassroomKey(classroomKey);
        if (keyRequestOptional.isEmpty()) {
            return ResponseEntity.ok("Key is available");
        }

        KeyRequest keyRequest = keyRequestOptional.get();
        return ResponseEntity.ok(keyRequest);
    }
    
    
    @GetMapping("/received-requests/{userId}")
    public ResponseEntity<?> getReceivedKeyRequests(@PathVariable Long userId) {
        // Fetch the user who is the current holder
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOptional.get();

        // Fetch all key requests where the recipient is the current holder
        List<KeyRequest> receivedRequests = keyRequestRepository.findKeysCurrentlyHeldByUser(user);

        if (receivedRequests.isEmpty()) {
            return ResponseEntity.ok("No key requests received.");
        }

        return ResponseEntity.ok(receivedRequests);
    }
    
    @PutMapping("/approve/{requestId}")
    public ResponseEntity<?> approveKeyRequest(@PathVariable Long requestId) {
        // Fetch the key request by ID
        Optional<KeyRequest> keyRequestOptional = keyRequestRepository.findById(requestId);
        if (keyRequestOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Key request not found");
        }

        KeyRequest keyRequest = keyRequestOptional.get();

        // Check if the request is already approved or declined
        if (!keyRequest.getStatus().equals("PENDING")) {
            return ResponseEntity.badRequest().body("Request is already processed");
        }

        // Update the status to APPROVED
        keyRequest.setStatus("APPROVED");
        keyRequestRepository.save(keyRequest);

        // Update the availability of the classroom key
        ClassroomKey classroomKey = keyRequest.getClassroomKey();
        classroomKey.setIsAvailable(0); // 0 means not available
        classroomKeyRepository.save(classroomKey);

        return ResponseEntity.ok("Key request approved successfully");
    }
    
    @PutMapping("/decline/{requestId}")
    public ResponseEntity<?> declineKeyRequest(@PathVariable Long requestId) {
        // Fetch the key request by ID
        Optional<KeyRequest> keyRequestOptional = keyRequestRepository.findById(requestId);
        if (keyRequestOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Key request not found");
        }

        KeyRequest keyRequest = keyRequestOptional.get();

        // Check if the request is already approved or declined
        if (!keyRequest.getStatus().equals("PENDING")) {
            return ResponseEntity.badRequest().body("Request is already processed");
        }

        // Update the status to DECLINED
        keyRequest.setStatus("DECLINED");
        keyRequestRepository.save(keyRequest);

        return ResponseEntity.ok("Key request declined successfully");
    }
}