package com.example.demo.controller;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AdminService;
import com.example.demo.service.StudentService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
   
	 @Autowired
	    private AdminService adminService;
	
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
     
    @GetMapping("/api/user")
    public User getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return null; // No user is authenticated
        }

        String email = principal.getAttribute("email"); // Get email from Google OAuth
        Optional<User> user = userRepository.findByEmail(email);

        return user.orElse(null); // Return user if found, otherwise null
    }
    // ✅ Admin Signup Endpoint
    @PostMapping("/signup2")
    public ResponseEntity<String> signup2(@RequestBody User admin) {
        System.out.println("Received Signup Request: " + admin.getEmail());

        if (userRepository.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        // ✅ Print raw password
        System.out.println("Raw Password: " + admin.getPassword());

        // ✅ Hash the password before saving
        String hashedPassword = passwordEncoder.encode(admin.getPassword());
        System.out.println("Hashed Password: " + hashedPassword);

        admin.setPassword(hashedPassword);
        admin.setRole("ADMIN");
        userRepository.save(admin);

        return ResponseEntity.ok("Admin registered successfully.");
    }

    // ✅ Admin Login Endpoint
    @PostMapping("/login2")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> loginRequest) {
        String userName = loginRequest.get("userName");
        String password = loginRequest.get("password");
        System.out.println("userName");
        
        System.out.println("Password" + password);
        Optional<User> optionalAdmin = userRepository.findByUserName(userName);
        if (optionalAdmin.isEmpty()) {
            System.out.println("❌ User not found: " + userName);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
        }

        User admin = optionalAdmin.get();

        // Debugging logs
        System.out.println("✅ Entered Password: " + password);
        System.out.println("✅ Stored Hashed Password in DB: " + admin.getPassword());

        // Test encoding manually
        String hashedEnteredPassword = passwordEncoder.encode(password);
        System.out.println("🔍 Hashed Entered Password (for testing): " + hashedEnteredPassword);
        
        boolean isPasswordMatching = passwordEncoder.matches(password, admin.getPassword());
        System.out.println("🔍 Does it match? " + isPasswordMatching);

        if (!isPasswordMatching) {
            System.out.println("❌ Password mismatch! Login failed.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
        }

        return ResponseEntity.ok(Map.of("message", "Login successful", "role", admin.getRole()));
    }

    
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
 
 @GetMapping("/recently-added-keys")
 public ResponseEntity<List<ClassroomKey>> getRecentlyAddedKeys() {
     List<ClassroomKey> recentKeys = adminService.getRecentlyAddedKeys();
     return ResponseEntity.ok(recentKeys);
 }
 
 @GetMapping("/key-history")
 public ResponseEntity<List<BorrowHistory>> getAllKeyHistory() {
     List<BorrowHistory> keyHistory = adminService.getAllKeyHistory();
     return ResponseEntity.ok(keyHistory);
 }
 
 @GetMapping("/borrowed-keys")
 public ResponseEntity<List<BorrowHistory>> getCurrentlyBorrowedKeys() {
     List<BorrowHistory> borrowedKeys = adminService.getCurrentlyBorrowedKeys();
     return ResponseEntity.ok(borrowedKeys);
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
 
 @GetMapping("/recently-added-bicycle")
 public ResponseEntity<List<Bicycle>> getRecentlyAddedCycle() {
     List<Bicycle> recentKeys = adminService.getRecentlyAddedCycle();
     return ResponseEntity.ok(recentKeys);
 }
 
 @GetMapping("/bicycle-history")
 public ResponseEntity<List<BorrowHistory>> getAllBicycleHistory() {
     List<BorrowHistory> bicycleHistory = adminService.getAllBicycleHistory();
     return ResponseEntity.ok(bicycleHistory);
 }


 @GetMapping("/borrowed-bicycles")
 public ResponseEntity<List<BorrowHistory>> getCurrentlyBorrowedBicycles() {
     List<BorrowHistory> borrowedBicycles = adminService.getCurrentlyBorrowedBicycles();
     return ResponseEntity.ok(borrowedBicycles);
 }

 // USER MANAGEMENT
 
 // CHANGING THE USERS ROLE TO CR 
 
 @PutMapping("/change-role/{userId}")
 //@PreAuthorize("hasRole('ADMIN')") // Only ADMIN can change roles
 public ResponseEntity<?> changeUserRole(@PathVariable Long userId) {
     Optional<User> optionalUser = userRepository.findById(userId);
     
     if (optionalUser.isEmpty()) {
         return ResponseEntity.badRequest().body("User not found");
     }

     User user = optionalUser.get();

     // 🔹 Toggle between CR & NON_CR
     if (user.getRole().equals("CR")) {
         user.setRole("NON_CR");
     } else if (user.getRole().equals("NON_CR")) {
         user.setRole("CR");
     } else {
         return ResponseEntity.badRequest().body("Invalid role change");
     }

     userRepository.save(user);
     return ResponseEntity.ok("User role updated to " + user.getRole());
 }
 //@PreAuthorize("hasRole('ADMIN')") // Only ADMIN can access this endpoint
 @GetMapping("/all-users")
 public ResponseEntity<List<User>> getAllUsers() {
     List<User> users = userRepository.findAll();
     return ResponseEntity.ok(users);
 }

 
}