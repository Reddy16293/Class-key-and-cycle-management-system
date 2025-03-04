package com.example.demo.service;

import com.example.demo.model.User;
import org.springframework.http.ResponseEntity;

public interface AdminService {
    ResponseEntity<String> signup(User admin);
    ResponseEntity<String> login(User admin);
}
