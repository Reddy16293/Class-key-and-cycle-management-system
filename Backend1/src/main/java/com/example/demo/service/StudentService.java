package com.example.demo.service;

import com.example.demo.model.User;
import org.springframework.http.ResponseEntity;

public interface StudentService {
    ResponseEntity<String> signup(User student);
    ResponseEntity<String> login(User student);
}