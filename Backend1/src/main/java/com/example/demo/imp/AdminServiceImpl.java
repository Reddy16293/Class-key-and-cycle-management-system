package com.example.demo.imp;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BicycleRepository bicycleRepository;
    @Autowired
    private ClassroomKeyRepository classroomKeyRepository;
    
   
   

    
    
    
    @Override
    public ResponseEntity signup(User admin) {
        if (!"ADMIN".equals(admin.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Invalid role for admin signup"));
        }
        userRepository.save(admin);

        // Prepare response with success message and user details
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Admin registered successfully");
        response.put("user", admin);  // Include the user details in the response

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity login(User admin) {
        Optional<User> existingAdmin = userRepository.findByUserName(admin.getUserName());
        if (existingAdmin.isPresent() && existingAdmin.get().getPassword().equals(admin.getPassword()) && "ADMIN".equals(existingAdmin.get().getRole())) {
            
            // Prepare response with success message and user details
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin login successful");
            response.put("user", existingAdmin.get());  // Include the user details in the response

            return ResponseEntity.ok(response);
        }

        // Return error if credentials are incorrect or role is invalid
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials or role"));
    }
    
   

    @Override
    public void addClassroom(ClassroomKey classroomKey) {
        Optional<ClassroomKey> existingKey = classroomKeyRepository.findByBlockNameAndClassroomName(
            classroomKey.getBlockName(), classroomKey.getClassroomName()
        );

        if (existingKey.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Classroom already exists");
        }

        classroomKeyRepository.save(classroomKey);
    }

    @Override
    public List<ClassroomKey> listAvailableKeys() {
        return classroomKeyRepository.findByIsAvailable(1);
    }

    @Override
    public List<ClassroomKey> listAllKeys() {
        return classroomKeyRepository.findAll();
    }
    
    @Override
    public List<ClassroomKey> getRecentlyAddedKeys() {
        return classroomKeyRepository.findTop5ByOrderByIdDesc();
    }

    
    @Override
    public void addBicycle(Bicycle bicycle) {
        bicycleRepository.save(bicycle);
    }

    @Override
    public ResponseEntity<String> bookBicycle(Long bicycleId, Long userId) {
        Optional<Bicycle> bicycleOptional = bicycleRepository.findById(bicycleId);
        if (bicycleOptional.isPresent()) {
            Bicycle bicycle = bicycleOptional.get();
            if (bicycle.getIsAvailable()) {
                bicycle.setAvailable(false);  // Mark bicycle as booked
                bicycleRepository.save(bicycle);
                return ResponseEntity.ok("Bicycle booked successfully by user ID: " + userId);
            } else {
                return ResponseEntity.status(400).body("Bicycle is already booked.");
            }
        } else {
            return ResponseEntity.status(404).body("Bicycle not found.");
        }
    }

    @Override
    public List<Bicycle> listAvailableBicycles() {
        return bicycleRepository.findByIsAvailable(true);
    }

    @Override
    public List<Bicycle> listAllBicycles() {
        return bicycleRepository.findAll();
    }
    
    @Override
    public List<Bicycle> getRecentlyAddedCycle() {
        return bicycleRepository.findTop5ByOrderByIdDesc();
    }
    
    
    @Autowired
    private BorrowHistoryRepository borrowHistoryRepository;
    
    @Override
    public List<BorrowHistory> getAllKeyHistory() {
        return borrowHistoryRepository.findByBicycleIsNull();
    }

    @Override
    public List<BorrowHistory> getCurrentlyBorrowedKeys() {
        return borrowHistoryRepository.findByBicycleIsNullAndReturnTimeIsNull();
    }

    @Override
    public List<BorrowHistory> getAllBicycleHistory() {
        return borrowHistoryRepository.findByBicycleIsNotNull();
    }

    @Override
    public List<BorrowHistory> getCurrentlyBorrowedBicycles() {
        return borrowHistoryRepository.findByBicycleIsNotNullAndReturnTimeIsNull();
    }

}