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
	
	 boolean existsByStudentIdAndClassroomKeyIdAndStatusIn(
		        Long studentId, 
		        Long classroomKeyId, 
		        List<String> statuses
		    );
	
	List<KeyRequest> findByClassroomKeyInAndStatus(List<ClassroomKey> classroomKeys, String status);
	 @Query("SELECT kr FROM KeyRequest kr " +
	           "JOIN kr.classroomKey ck " +
	           "JOIN BorrowHistory bh ON ck.id = bh.classroomKey.id " +
	           "WHERE bh.student = :user")
	    List<KeyRequest> findKeysCurrentlyHeldByUser(@Param("user") User user);
	 
	 Optional<KeyRequest> findById(Long id);
	 List<KeyRequest> findByStudent(User student);
	 @Query("SELECT bh.student FROM BorrowHistory bh " +
	           "WHERE bh.classroomKey = :classroomKey " +
	           "AND bh.returnTime IS NULL " +  // Not returned yet
	           "ORDER BY bh.borrowTime DESC LIMIT 1")
	    Optional<User> findCurrentHolderByClassroomKey(@Param("classroomKey") ClassroomKey classroomKey);
	 
	 // @Query("SELECT kr FROM KeyRequest kr WHERE kr.classroomKey = :classroomKey AND kr.status = 'APPROVED'")
	 // Optional<KeyRequest> findByClassroomKey(@Param("classroomKey") ClassroomKey classroomKey);
	 List<KeyRequest> findByClassroomKeyIn(List<ClassroomKey> classroomKeys);
	 List<KeyRequest> findByClassroomKeyOrderByRequestTimeDesc(ClassroomKey classroomKey);
	
	 
	 @Query("SELECT r FROM KeyRequest r JOIN FETCH r.classroomKey WHERE r.student = :student")
	 List<KeyRequest> findByStudentWithClassroomDetails(@Param("student") User student);
	 
	 
	 
}