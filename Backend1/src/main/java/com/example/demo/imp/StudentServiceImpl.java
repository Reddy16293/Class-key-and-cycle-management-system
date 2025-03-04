package com.example.demo.imp;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity signup(User student) {
        if (!"STUDENT".equals(student.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Invalid role for student signup"));
        }
        userRepository.save(student);

        // Prepare response with success message and user details
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Student registered successfully");
        response.put("user", student);  // Include the user details in the response

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity login(User student) {
        Optional<User> existingStudent = userRepository.findByUsername(student.getUsername());
        if (existingStudent.isPresent() && existingStudent.get().getPassword().equals(student.getPassword()) && "STUDENT".equals(existingStudent.get().getRole())) {

            // Prepare response with success message and user details
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Student login successful");
            response.put("user", existingStudent.get());  // Include the user details in the response

            return ResponseEntity.ok(response);
        }

        // Return error if credentials are incorrect or role is invalid
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials or role"));
    }
}
