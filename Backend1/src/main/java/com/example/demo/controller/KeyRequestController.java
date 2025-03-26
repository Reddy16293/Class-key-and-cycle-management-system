package com.example.demo.controller;
import java.util.*;
import com.example.demo.model.KeyRequest;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.KeyRequestRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    
    private static final String PENDING_STATUS = "PENDING";
    private static final String APPROVED_STATUS = "APPROVED";


    @GetMapping("/check-pending/{userId}/{keyId}")
    public ResponseEntity<?> checkPendingRequest(
        @PathVariable Long userId, 
        @PathVariable Long keyId
    ) {
        try {
            // Check if there's any request with PENDING or APPROVED status
            boolean hasPending = keyRequestRepository.existsByStudentIdAndClassroomKeyIdAndStatusIn(
                userId, 
                keyId, 
                Arrays.asList(PENDING_STATUS, APPROVED_STATUS)
            );
            
            return ResponseEntity.ok(Collections.singletonMap("hasPendingRequest", hasPending));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Failed to check pending requests"));
        }
    }

    // API to request a key from one classroom to another
 // Request a key with time and purpose
   /*  @PostMapping("/request")
    public ResponseEntity<String> requestKey(
            @RequestParam Long studentId,
            @RequestParam Long classroomKeyId,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam String purpose) {

        Timestamp startTimestamp, endTimestamp;
        try {
            if (startTime.contains("T")) {
                // Handle ISO format (e.g., "2025-03-25T22:30")
                startTimestamp = Timestamp.valueOf(LocalDateTime.parse(startTime));
                endTimestamp = Timestamp.valueOf(LocalDateTime.parse(endTime));
            } else {
                // Handle traditional format (e.g., "2025-03-25 22:30:00")
                // Ensure the time has seconds if not provided
                if (!startTime.contains(":")) {
                    startTime += " 00:00:00";
                } else if (startTime.split(":").length == 2) {
                    startTime += ":00";
                }
                startTimestamp = Timestamp.valueOf(startTime.replace("T", " "));
                
                if (!endTime.contains(":")) {
                    endTime += " 00:00:00";
                } else if (endTime.split(":").length == 2) {
                    endTime += ":00";
                }
                endTimestamp = Timestamp.valueOf(endTime.replace("T", " "));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid time format. Use 'yyyy-MM-dd HH:mm:ss' or 'yyyy-MM-ddTHH:mm'");
        }

        if (endTimestamp.before(startTimestamp)) {
            return ResponseEntity.badRequest().body("End time must be after start time");
        }

        Optional<User> studentOptional = userRepository.findById(studentId);
        Optional<ClassroomKey> classroomKeyOptional = classroomKeyRepository.findById(classroomKeyId);

        if (studentOptional.isEmpty() || classroomKeyOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Student or classroom key not found");
        }

        KeyRequest keyRequest = new KeyRequest();
        keyRequest.setStudent(studentOptional.get());
        keyRequest.setClassroomKey(classroomKeyOptional.get());
        keyRequest.setRequestTime(Timestamp.from(Instant.now()));
        keyRequest.setStatus("PENDING");
        keyRequest.setStartTime(startTimestamp);
        keyRequest.setEndTime(endTimestamp);
        keyRequest.setPurpose(purpose);

        keyRequestRepository.save(keyRequest);

        return ResponseEntity.ok("Key request submitted successfully");
    } */

    // Initiate key transfer (by current holder)
    @PutMapping("/initiate-transfer/{requestId}")
    public ResponseEntity<String> initiateTransfer(@PathVariable Long requestId) {
        Optional<KeyRequest> requestOptional = keyRequestRepository.findById(requestId);
        if (requestOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Request not found");
        }

        KeyRequest request = requestOptional.get();
        if (!"APPROVED".equals(request.getStatus())) {
            return ResponseEntity.badRequest().body("Only approved requests can be transferred");
        }

        request.setStatus("TRANSFER_INITIATED");
        keyRequestRepository.save(request);

        return ResponseEntity.ok("Transfer initiated. Waiting for requester to accept");
    }

    // Complete key transfer (by requester)
    @PutMapping("/complete-transfer/{requestId}")
    public ResponseEntity<String> completeTransfer(@PathVariable Long requestId) {
        Optional<KeyRequest> requestOptional = keyRequestRepository.findById(requestId);
        if (requestOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Request not found");
        }

        KeyRequest request = requestOptional.get();
        if (!"TRANSFER_INITIATED".equals(request.getStatus())) {
            return ResponseEntity.badRequest().body("Transfer not initiated for this request");
        }

        // 1. Mark current borrow as returned
        Optional<BorrowHistory> currentBorrow = borrowHistoryRepository
                .findByClassroomKeyAndIsReturned(request.getClassroomKey(), false);
        
        if (currentBorrow.isEmpty()) {
            return ResponseEntity.badRequest().body("Key is not currently borrowed");
        }

        BorrowHistory currentHistory = currentBorrow.get();
        currentHistory.setIsReturned(true);
        currentHistory.setReturnTime(new Timestamp(System.currentTimeMillis()));
        borrowHistoryRepository.save(currentHistory);

        // 2. Create new borrow for requester
        BorrowHistory newHistory = new BorrowHistory();
        newHistory.setStudent(request.getStudent());
        newHistory.setClassroomKey(request.getClassroomKey());
        newHistory.setBorrowTime(new Timestamp(System.currentTimeMillis()));
        newHistory.setIsReturned(false);
        borrowHistoryRepository.save(newHistory);

        // 3. Update request status
        request.setStatus("TRANSFER_COMPLETED");
        keyRequestRepository.save(request);

        return ResponseEntity.ok("Key successfully transferred");
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
            Map<String, Object> response = new HashMap<>();
            response.put("status", "Key is available");
            response.put("keyStatus", "Available");
            return ResponseEntity.ok(response);
        }

        // 3. Get current holder (from borrow history)
        Optional<User> currentHolderOptional = borrowHistoryRepository.findCurrentHolderByClassroomKey(classroomKey);
        
        // 4. Build response
        Map<String, Object> response = new HashMap<>();
        response.put("keyStatus", "Unavailable");
        
        // Add current holder if exists
        currentHolderOptional.ifPresent(currentHolder -> {
            Map<String, Object> holderInfo = new HashMap<>();
            holderInfo.put("id", currentHolder.getId());
            holderInfo.put("name", currentHolder.getName());
            holderInfo.put("email", currentHolder.getEmail());
            response.put("currentHolder", holderInfo);
        });

        // 5. Get the most recent request if exists
        List<KeyRequest> keyRequests = keyRequestRepository.findByClassroomKeyOrderByRequestTimeDesc(classroomKey);
        if (!keyRequests.isEmpty()) {
            KeyRequest keyRequest = keyRequests.get(0);
            User requester = keyRequest.getStudent();
            Map<String, Object> requesterInfo = new HashMap<>();
            requesterInfo.put("id", requester.getId());
            requesterInfo.put("name", requester.getName());
            requesterInfo.put("email", requester.getEmail());
            response.put("requester", requesterInfo);
            response.put("requestStatus", keyRequest.getStatus());
            response.put("requestTime", keyRequest.getRequestTime());
        }

        // Classroom details
        Map<String, Object> classroomInfo = new HashMap<>();
        classroomInfo.put("classroomName", classroomKey.getClassroomName());
        classroomInfo.put("blockName", classroomKey.getBlockName());
        classroomInfo.put("floor", classroomKey.getFloor());
        response.put("classroom", classroomInfo);

        return ResponseEntity.ok(response);
    }

    // Other controller methods remain the same...
    @PostMapping("/request")
    public ResponseEntity<String> requestKey(
            @RequestParam Long studentId,
            @RequestParam Long classroomKeyId,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam String purpose) {

        Timestamp startTimestamp, endTimestamp;
        try {
            if (startTime.contains("T")) {
                startTimestamp = Timestamp.valueOf(LocalDateTime.parse(startTime));
                endTimestamp = Timestamp.valueOf(LocalDateTime.parse(endTime));
            } else {
                if (!startTime.contains(":")) {
                    startTime += " 00:00:00";
                } else if (startTime.split(":").length == 2) {
                    startTime += ":00";
                }
                startTimestamp = Timestamp.valueOf(startTime.replace("T", " "));
                
                if (!endTime.contains(":")) {
                    endTime += " 00:00:00";
                } else if (endTime.split(":").length == 2) {
                    endTime += ":00";
                }
                endTimestamp = Timestamp.valueOf(endTime.replace("T", " "));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid time format. Use 'yyyy-MM-dd HH:mm:ss' or 'yyyy-MM-ddTHH:mm'");
        }

        if (endTimestamp.before(startTimestamp)) {
            return ResponseEntity.badRequest().body("End time must be after start time");
        }

        Optional<User> studentOptional = userRepository.findById(studentId);
        Optional<ClassroomKey> classroomKeyOptional = classroomKeyRepository.findById(classroomKeyId);

        if (studentOptional.isEmpty() || classroomKeyOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Student or classroom key not found");
        }

        KeyRequest keyRequest = new KeyRequest();
        keyRequest.setStudent(studentOptional.get());
        keyRequest.setClassroomKey(classroomKeyOptional.get());
        keyRequest.setRequestTime(Timestamp.from(Instant.now()));
        keyRequest.setStatus("PENDING");
        keyRequest.setStartTime(startTimestamp);
        keyRequest.setEndTime(endTimestamp);
        keyRequest.setPurpose(purpose);

        keyRequestRepository.save(keyRequest);

        return ResponseEntity.ok("Key request submitted successfully");
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
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                       .body(Map.of("message", "User not found"));
            }

            List<KeyRequest> sentRequests = keyRequestRepository.findByStudent(userOptional.get());
            if (sentRequests.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<Map<String, Object>> response = sentRequests.stream().map(request -> {
                Map<String, Object> requestData = new HashMap<>();
                
                // Basic request info
                requestData.put("id", request.getId());
                requestData.put("status", request.getStatus());
                requestData.put("requestTime", request.getRequestTime());
                requestData.put("startTime", request.getStartTime());
                requestData.put("endTime", request.getEndTime());
                requestData.put("purpose", request.getPurpose());
                
                // Classroom key info
                ClassroomKey classroomKey = request.getClassroomKey();
                Map<String, Object> classroomInfo = new HashMap<>();
                classroomInfo.put("id", classroomKey.getId());
                classroomInfo.put("blockName", classroomKey.getBlockName());
                classroomInfo.put("classroomName", classroomKey.getClassroomName());
                classroomInfo.put("floor", classroomKey.getFloor());
                requestData.put("classroomKey", classroomInfo);

                // Holder at request time - using the new query
                List<BorrowHistory> holderAtRequest = borrowHistoryRepository
                    .findHolderAtRequestTime(
                        classroomKey, 
                        request.getRequestTime()
                    );
                
                Map<String, Object> holderAtRequestTime = new HashMap<>();
                if (!holderAtRequest.isEmpty()) {
                    User holder = holderAtRequest.get(0).getStudent();
                    holderAtRequestTime.put("name", holder.getName());
                    holderAtRequestTime.put("email", holder.getEmail());
                } else {
                    holderAtRequestTime.put("name", "Unknown at request time");
                    holderAtRequestTime.put("email", "");
                }
                requestData.put("holderAtRequestTime", holderAtRequestTime);

                // Current holder
                Optional<User> currentHolder = borrowHistoryRepository
                    .findCurrentHolderByClassroomKey(classroomKey);
                
                Map<String, Object> currentHolderInfo = new HashMap<>();
                currentHolder.ifPresentOrElse(
                    holder -> {
                        currentHolderInfo.put("name", holder.getName());
                        currentHolderInfo.put("email", holder.getEmail());
                    },
                    () -> {
                        currentHolderInfo.put("name", "Currently unassigned");
                        currentHolderInfo.put("email", "");
                    }
                );
                requestData.put("currentHolder", currentHolderInfo);

                return requestData;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body(Map.of("message", "Error processing request", "error", e.getMessage()));
        }
    }
    
    @PutMapping("/cancel/{requestId}")
    public ResponseEntity<?> cancelKeyRequest(@PathVariable Long requestId) {
        try {
            Optional<KeyRequest> requestOptional = keyRequestRepository.findById(requestId);
            if (requestOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                       .body(Map.of("message", "Request not found"));
            }

            KeyRequest request = requestOptional.get();
            
            // Only allow canceling if request is in a cancelable state
            if (!request.getStatus().equals("PENDING") && !request.getStatus().equals("APPROVED")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                       .body(Map.of("message", "Request cannot be canceled in its current state"));
            }

            request.setStatus("CANCELLED");
            keyRequestRepository.save(request);
            
            return ResponseEntity.ok(Map.of("message", "Request cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body(Map.of("message", "Error cancelling request", "error", e.getMessage()));
        }
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