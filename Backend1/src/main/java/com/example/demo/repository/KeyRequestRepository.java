package com.example.demo.repository;

import com.example.demo.model.ClassroomKey;
import com.example.demo.model.KeyRequest;
import com.example.demo.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KeyRequestRepository extends JpaRepository<KeyRequest, Long> {
	Optional<KeyRequest> findByClassroomKey(ClassroomKey classroomKey);
	List<KeyRequest> findByClassroomKeyAndStatus(ClassroomKey classroomKey, String status);
	
	 @Query("SELECT kr FROM KeyRequest kr " +
	           "JOIN kr.classroomKey ck " +
	           "JOIN BorrowHistory bh ON ck.id = bh.classroomKey.id " +
	           "WHERE bh.student = :user")
	    List<KeyRequest> findKeysCurrentlyHeldByUser(@Param("user") User user);
	 
	 Optional<KeyRequest> findById(Long id);
}
