package com.example.demo.controller;

//AdminController.java


import com.example.demo.model.User;
import com.example.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

 @Autowired
 private AdminService adminService;

 @PostMapping("/signup")
 public ResponseEntity<String> signup(@RequestBody User admin) {
     return adminService.signup(admin);
 }

 @PostMapping("/login")
 public ResponseEntity<String> login(@RequestBody User admin) {
     return adminService.login(admin);
 }
}

