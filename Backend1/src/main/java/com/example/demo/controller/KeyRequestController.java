package com.example.demo.controller;

import com.example.demo.model.KeyRequest;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.KeyRequestRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/key-requests")
public class KeyRequestController {

    @Autowired
    private KeyRequestRepository keyRequestRepository;

    @Autowired
    private ClassroomKeyRepository classroomKeyRepository;
    @Autowired
    private BorrowHistoryRepository borrowHistoryRepository;


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
        // 1. Fetch the classroom key
        Optional<ClassroomKey> classroomKeyOptional = classroomKeyRepository.findById(classroomKeyId);
        if (classroomKeyOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Classroom key not found");
        }
        ClassroomKey classroomKey = classroomKeyOptional.get();

        // 2. Check if key is available
        if (classroomKey.getIsAvailable() == 1) {
            return ResponseEntity.ok(Collections.singletonMap("status", "Key is available"));
        }

        // 3. Get all key requests for this classroom key and sort by request time (newest first)
        List<KeyRequest> keyRequests = keyRequestRepository.findByClassroomKeyOrderByRequestTimeDesc(classroomKey);
        if (keyRequests.isEmpty()) {
            return ResponseEntity.badRequest().body("Key is marked as unavailable but no request found");
        }

        // Get the most recent request
        KeyRequest keyRequest = keyRequests.get(0);
        
        // 4. Get current holder (from borrow history)
        Optional<User> currentHolderOptional = borrowHistoryRepository.findCurrentHolderByClassroomKey(classroomKey);
        
        // 5. Build response
        Map<String, Object> response = new HashMap<>();
        response.put("keyStatus", classroomKey.getIsAvailable() == 0 ? "Unavailable" : "Available");
        
        // Requester details
        User requester = keyRequest.getStudent();
        Map<String, Object> requesterInfo = new HashMap<>();
        requesterInfo.put("id", requester.getId());
        requesterInfo.put("name", requester.getName());
        requesterInfo.put("email", requester.getEmail());
        response.put("requester", requesterInfo);
        response.put("requestStatus", keyRequest.getStatus());
        response.put("requestTime", keyRequest.getRequestTime());

        // Current holder details (if any)
        if (currentHolderOptional.isPresent()) {
            User currentHolder = currentHolderOptional.get();
            Map<String, Object> holderInfo = new HashMap<>();
            holderInfo.put("id", currentHolder.getId());
            holderInfo.put("name", currentHolder.getName());
            holderInfo.put("email", currentHolder.getEmail());
            response.put("currentHolder", holderInfo);
        } else {
            response.put("currentHolder", null);
        }

        // Classroom details
        Map<String, Object> classroomInfo = new HashMap<>();
        classroomInfo.put("classroomName", classroomKey.getClassroomName());
        classroomInfo.put("blockName", classroomKey.getBlockName());
        classroomInfo.put("floor", classroomKey.getFloor());
        response.put("classroom", classroomInfo);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/received-requests/{userId}")
    public ResponseEntity<?> getReceivedKeyRequests(@PathVariable Long userId) {
        // Fetch the user who is the current holder
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOptional.get();

        // Get all classroom keys currently held by this user
        List<ClassroomKey> heldKeys = classroomKeyRepository.findByCurrentHolder(user);

        if (heldKeys.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Get all key requests for these classroom keys (including PENDING, APPROVED, and DECLINED)
        List<KeyRequest> receivedRequests = keyRequestRepository.findByClassroomKeyIn(heldKeys);

        // Sort by request time (newest first)
        receivedRequests.sort((a, b) -> b.getRequestTime().compareTo(a.getRequestTime()));

        return ResponseEntity.ok(receivedRequests);
    }
    
    @GetMapping("/sent-requests/{userId}")
    public ResponseEntity<?> getSentKeyRequests(@PathVariable Long userId) {
        // Fetch the user who sent the requests
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOptional.get();

        // Fetch all key requests sent by this user with classroom key details
        List<KeyRequest> sentRequests = keyRequestRepository.findByStudentWithClassroomDetails(user);

        if (sentRequests.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Create response DTOs with all needed information
        List<Map<String, Object>> response = sentRequests.stream().map(request -> {
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("id", request.getId());
            requestData.put("status", request.getStatus());
            requestData.put("requestTime", request.getRequestTime());
            
            // Classroom details from the original request
            ClassroomKey classroomKey = request.getClassroomKey();
            Map<String, Object> classroomInfo = new HashMap<>();
            classroomInfo.put("blockName", classroomKey.getBlockName());
            classroomInfo.put("classroomName", classroomKey.getClassroomName());
            classroomInfo.put("floor", classroomKey.getFloor());
            requestData.put("classroom", classroomInfo);

            // Holder at time of request (from borrow history when request was made)
            Optional<BorrowHistory> requestTimeHolder = borrowHistoryRepository
                .findByClassroomKeyAndBorrowTimeBeforeOrderByBorrowTimeDesc(
                    classroomKey, 
                    request.getRequestTime()
                )
                .stream()
                .findFirst();
            
            if (requestTimeHolder.isPresent()) {
                Map<String, Object> holderAtRequestTime = new HashMap<>();
                holderAtRequestTime.put("name", requestTimeHolder.get().getStudent().getName());
                holderAtRequestTime.put("email", requestTimeHolder.get().getStudent().getEmail());
                requestData.put("holderAtRequestTime", holderAtRequestTime);
            } else {
                requestData.put("holderAtRequestTime", null);
            }

            // Current holder information
            Optional<User> currentHolder = borrowHistoryRepository.findCurrentHolderByClassroomKey(classroomKey);
            if (currentHolder.isPresent()) {
                Map<String, Object> currentHolderInfo = new HashMap<>();
                currentHolderInfo.put("name", currentHolder.get().getName());
                currentHolderInfo.put("email", currentHolder.get().getEmail());
                requestData.put("currentHolder", currentHolderInfo);
            } else {
                requestData.put("currentHolder", null);
            }

            // Key status
            requestData.put("keyStatus", classroomKey.getIsAvailable() == 1 ? "Available" : "Unavailable");

            return requestData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }    
    @PutMapping("/cancel/{requestId}")
    public ResponseEntity<?> cancelKeyRequest(@PathVariable Long requestId) {
        // Fetch the key request by ID
        Optional<KeyRequest> keyRequestOptional = keyRequestRepository.findById(requestId);
        if (keyRequestOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Key request not found");
        }

        KeyRequest keyRequest = keyRequestOptional.get();

        // Check if the request is already approved or declined
        if (!keyRequest.getStatus().equals("PENDING")) {
            return ResponseEntity.badRequest().body("Request is already processed and cannot be canceled");
        }

        // Update the status to CANCELED
        keyRequest.setStatus("CANCELED");
        keyRequestRepository.save(keyRequest);

        return ResponseEntity.ok("Key request canceled successfully");
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