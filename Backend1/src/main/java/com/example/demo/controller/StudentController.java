package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.StudentService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User student) {
        return studentService.signup(student);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User student) {
        return studentService.login(student);
    }

    @PostMapping("/book-classroom-key/{keyId}")
    public ResponseEntity<String> bookClassroomKey(@PathVariable Long keyId, @RequestBody User student) {
        return studentService.bookClassroomKey(keyId, student);
    }

    // Endpoint to check key availability
    @GetMapping("/check-key-availability/{keyId}")
    public ResponseEntity<Integer> checkKeyAvailability(@PathVariable Long keyId) {  // Use @PathVariable instead of @RequestParam
        return studentService.checkKeyAvailability(keyId);
    }

    // Endpoint to check key availability for all available rooms
    @GetMapping("/available-rooms")
    public ResponseEntity<List<Map<String, Object>>> getAvailableRooms() {
        return studentService.getAvailableRooms();
    }
}
