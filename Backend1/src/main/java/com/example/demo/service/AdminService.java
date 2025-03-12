package com.example.demo.service;

import com.example.demo.model.Bicycle;
import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AdminService {
	
	 ResponseEntity<String> signup(User admin);
	    ResponseEntity<String> login(User admin);
    void addClassroom(ClassroomKey classroomKey);
    List<ClassroomKey> listAvailableKeys();
    List<ClassroomKey> listAllKeys();
    List<ClassroomKey> getRecentlyAddedKeys();

    // New methods for bicycles
    void addBicycle(Bicycle bicycle);
    ResponseEntity<String> bookBicycle(Long bicycleId, Long userId);
    List<Bicycle> listAvailableBicycles();
    List<Bicycle> listAllBicycles();
    List<Bicycle> getRecentlyAddedCycle();
    
    //for history
    List<BorrowHistory> getAllKeyHistory();
    List<BorrowHistory> getCurrentlyBorrowedKeys();
    List<BorrowHistory> getAllBicycleHistory();
    List<BorrowHistory> getCurrentlyBorrowedBicycles();
}