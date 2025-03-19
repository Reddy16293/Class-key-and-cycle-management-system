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

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
