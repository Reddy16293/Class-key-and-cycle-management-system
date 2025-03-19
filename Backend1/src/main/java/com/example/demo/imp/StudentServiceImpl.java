package com.example.demo.imp;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import com.example.demo.repository.BicycleRepository;
import com.example.demo.repository.BorrowHistoryRepository;
import com.example.demo.repository.ClassroomKeyRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StudentServiceImpl implements StudentService {
	private static final Logger logger = LoggerFactory.getLogger(StudentServiceImpl.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BicycleRepository bicycleRepository;
    @Autowired
    private final BorrowHistoryRepository borrowHistoryRepository;
    public StudentServiceImpl(UserRepository userRepository, 
            ClassroomKeyRepository classroomKeyRepository, 
            BorrowHistoryRepository borrowHistoryRepository) {
          this.userRepository = userRepository;
           this.classroomKeyRepository = classroomKeyRepository;
           this.borrowHistoryRepository = borrowHistoryRepository;
}

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
        Optional<User> existingStudent = userRepository.findByUserName(student.getUserName());
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
    
    @Autowired
    private ClassroomKeyRepository classroomKeyRepository;

    @Override
    public ResponseEntity<String> bookClassroomKey(Long classroomKeyId, Long userId) {
        Optional<ClassroomKey> keyOptional = classroomKeyRepository.findById(classroomKeyId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (keyOptional.isEmpty() || userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid key or user ID");
        }

        ClassroomKey key = keyOptional.get();
        User user = userOptional.get();

        if (key.getIsAvailable() == 0) {  // If isAvailable is 0, key is already borrowed
            return ResponseEntity.badRequest().body("Key is already borrowed");
        }

        // Mark the key as borrowed (set isAvailable = 0)
        key.setIsAvailable(0);
        classroomKeyRepository.save(key);

        // Save the borrowing history
        BorrowHistory history = new BorrowHistory();
        history.setStudent(user);
        history.setClassroomKey(key);
        history.setBorrowTime(new Timestamp(System.currentTimeMillis()));
        borrowHistoryRepository.save(history);

        return ResponseEntity.ok("Key successfully booked by " + user.getName());
    }

    @Override
    public ResponseEntity<Integer> checkKeyAvailability(Long keyId) {
        Optional<ClassroomKey> keyOptional = classroomKeyRepository.findById(keyId);
        return keyOptional.map(classroomKey -> ResponseEntity.ok(classroomKey.getIsAvailable()))
                .orElseGet(() -> ResponseEntity.status(404).body(-1));
    }
    
    @Override
    public ResponseEntity<List<Map<String, Object>>> getAvailableRooms() {
        List<ClassroomKey> availableRooms = classroomKeyRepository.findByIsAvailable(1);

        // Convert ClassroomKey entities to a simpler Map with only necessary details
        List<Map<String, Object>> response = availableRooms.stream().map(room -> {
            Map<String, Object> roomDetails = new HashMap<>();
            roomDetails.put("blockName", room.getBlockName());
            roomDetails.put("classroomName", room.getClassroomName());
            roomDetails.put("isAvailable", room.getIsAvailable());
            return roomDetails;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    //For Bicycle Management
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
    
    

    public List<ClassroomKey> getAvailableRooms(String blockName, String floor) {
        return classroomKeyRepository.findByBlockNameAndFloorAndIsAvailable(blockName, floor, 1);
    }

    public String bookClassroomKey(String blockName, String classroomName, Long userId) {
        Optional<ClassroomKey> keyOptional = classroomKeyRepository.findByBlockNameAndClassroomName(blockName, classroomName);
        if (keyOptional.isEmpty()) {
            return "Invalid block or classroom name";
        }

        ClassroomKey key = keyOptional.get();
        if (key.getIsAvailable() == 0) {
            return "Key is already borrowed";
        }

        key.setIsAvailable(0);
        classroomKeyRepository.save(key);
        return "Key successfully booked";
    }

}