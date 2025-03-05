package com.example.demo.controller;

import com.example.demo.model.Bicycle;
import com.example.demo.model.ClassroomKey;

//AdminController.java


import com.example.demo.model.User;
import com.example.demo.service.AdminService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
 
 @PostMapping("/addclassrooms")
 public ResponseEntity<ClassroomKey> addClassroom(@RequestBody ClassroomKey classroomKey) {
     adminService.addClassroom(classroomKey);
     return ResponseEntity.status(HttpStatus.CREATED).body(classroomKey);
 }
 
 /*@GetMapping("/check-key-availability/{keyId}")
 public ResponseEntity<Integer> checkKeyAvailability(@PathVariable Long keyId) {  // Use @PathVariable instead of @RequestParam
     return adminService.checkKeyAvailability(keyId);
 }*/

 // Endpoint to check key availability for all available rooms
 @GetMapping("/available-keys")
 public ResponseEntity<List<ClassroomKey>> listAvailableKeys() {
     List<ClassroomKey> bicycles = adminService.listAvailableKeys();
     return ResponseEntity.ok(bicycles);
 }

 @GetMapping("/all-keys")
 public ResponseEntity<List<ClassroomKey>> listAllKeys(){
     List<ClassroomKey> bicycles = adminService.listAllKeys();
     return ResponseEntity.ok(bicycles);
 }
//New API Endpoints for Bicycle Management

 @PostMapping("/addbicycle")
 public ResponseEntity<Bicycle> addBicycle(@RequestBody Bicycle bicycle) {
     adminService.addBicycle(bicycle);
     return ResponseEntity.status(HttpStatus.CREATED).body(bicycle);
 }

 @PostMapping("/bookbicycle/{bicycleId}")
 public ResponseEntity<String> bookBicycle(@PathVariable Long bicycleId, @RequestParam Long userId) {
     return adminService.bookBicycle(bicycleId, userId);
 }

 @GetMapping("/available-bicycles")
 public ResponseEntity<List<Bicycle>> listAvailableBicycles() {
     List<Bicycle> bicycles = adminService.listAvailableBicycles();
     return ResponseEntity.ok(bicycles);
 }

 @GetMapping("/all-bicycles")
 public ResponseEntity<List<Bicycle>> listAllBicycles() {
     List<Bicycle> bicycles = adminService.listAllBicycles();
     return ResponseEntity.ok(bicycles);
 }
}

