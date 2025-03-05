package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.ClassroomKey;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface StudentService {
    ResponseEntity<String> signup(User student);
    ResponseEntity<String> login(User student);
    
    // New methods for classroom key management
    ResponseEntity<String> bookClassroomKey(Long keyId, User student);
    ResponseEntity<Integer> checkKeyAvailability(Long keyId);
    ResponseEntity<List<Map<String, Object>>> getAvailableRooms();
}
