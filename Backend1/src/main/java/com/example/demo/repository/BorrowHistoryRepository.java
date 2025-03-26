package com.example.demo.repository;

import com.example.demo.model.BorrowHistory;

import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowHistoryRepository extends JpaRepository<BorrowHistory, Long> {

	
	// Find feedback for specific bicycle
    List<BorrowHistory> findByBicycleIdAndFeedbackNotNullOrderByBorrowTimeDesc(Long bicycleId);
    // Find by bicycle ID with condition description
    List<BorrowHistory> findByBicycleIdAndConditionDescriptionNotNullOrderByBorrowTimeDesc(Long bicycleId);
    
 // Find bicycle feedback by student ID
    Page<BorrowHistory> findByStudent_IdAndBicycleIsNotNullAndConditionDescriptionIsNotNull(
        Long studentId, Pageable pageable);
    
    // Find all bicycle feedback
    Page<BorrowHistory> findByBicycleIsNotNullAndConditionDescriptionIsNotNull(Pageable pageable);
    // Find bicycle feedback by student ID (corrected from userId to student_Id)
    Page<BorrowHistory> findByStudent_IdAndBicycleIsNotNullAndFeedbackIsNotNull(
        Long studentId, Pageable pageable);
    
 // Find all bicycle feedback
    Page<BorrowHistory> findByBicycleIsNotNullAndFeedbackIsNotNull(Pageable pageable);
    
 // Custom query to find bicycle feedback by borrow ID
    @Query("SELECT bh FROM BorrowHistory bh WHERE bh.id = :borrowId AND bh.bicycle IS NOT NULL")
    BorrowHistory findBicycleFeedbackByBorrowId(@Param("borrowId") Long borrowId);
    
	 // Existing method
	List<BorrowHistory> findByStudentIdAndBicycleIsNotNull(Long student_id);
    List<BorrowHistory> findByStudentIdAndClassroomKeyIsNotNull(Long student_id);
    
    // For bicycle-specific history
    List<BorrowHistory> findByStudentIdAndBicycleIsNotNullAndIsReturnedFalse(Long student_id);
    
    // For classroom key-specific history
    List<BorrowHistory> findByStudentIdAndClassroomKeyIsNotNullAndIsReturnedFalse(Long student_id);
    
    // For all bicycle borrow history (active and returned)
  
    
    // For all classroom key borrow history (active and returned)
    List<BorrowHistory> findByClassroomKeyIsNotNull();
    // Fetch all key borrow history (where bicycle is null)
    List<BorrowHistory> findByBicycleIsNull();

    // Fetch currently borrowed keys (not returned)
    List<BorrowHistory> findByBicycleIsNullAndReturnTimeIsNull();

    // Fetch all bicycle borrow history (where bicycle is not null)
    List<BorrowHistory> findByBicycleIsNotNull();

    // Fetch currently borrowed bicycles (not returned)
    List<BorrowHistory> findByBicycleIsNotNullAndReturnTimeIsNull();
    
    List<BorrowHistory> findByStudentId(Long studentId);
    
 // Find if a student already has this key and has not returned it
    Optional<BorrowHistory> findByStudentAndClassroomKeyAndIsReturned(User student, ClassroomKey classroomKey, boolean isReturned);
    
//    @Query("SELECT bh.student FROM BorrowHistory bh " +
//            "WHERE bh.classroomKey = :classroomKey " +
//            "AND bh.returnTime IS NULL " +  // Not returned yet
//            "ORDER BY bh.borrowTime DESC LIMIT 1")
//     Optional<User> findCurrentHolderByClassroomKey(@Param("classroomKey") ClassroomKey classroomKey);

    // Find if the key is currently borrowed by anyone
    Optional<BorrowHistory> findByClassroomKeyAndIsReturned(ClassroomKey classroomKey, boolean isReturned);
    
    List<BorrowHistory> findByStudentIdAndIsReturnedFalse(Long studentId);
    
    @Query("SELECT bh FROM BorrowHistory bh " +
    	       "WHERE bh.classroomKey = :classroomKey " +
    	       "AND bh.borrowTime <= :timestamp " +
    	       "AND (bh.returnTime IS NULL OR bh.returnTime > :timestamp) " +
    	       "ORDER BY bh.borrowTime DESC")
    	List<BorrowHistory> findByClassroomKeyAndBorrowTimeBeforeOrderByBorrowTimeDesc(
    	    @Param("classroomKey") ClassroomKey classroomKey,
    	    @Param("timestamp") Timestamp timestamp
    	);
    

    
    Optional<BorrowHistory> findTopByClassroomKeyAndBorrowTimeLessThanEqualAndIsReturnedOrderByBorrowTimeDesc(
        ClassroomKey classroomKey, 
        Timestamp borrowTime, 
        boolean isReturned
    );
    
    
    @Query("SELECT bh FROM BorrowHistory bh " +
            "WHERE bh.classroomKey = :classroomKey " +
            "AND bh.borrowTime <= :timestamp " +
            "AND bh.isReturned = false " +
            "ORDER BY bh.borrowTime DESC")
     List<BorrowHistory> findActiveBorrowsAtTime(
         @Param("classroomKey") ClassroomKey classroomKey,
         @Param("timestamp") Timestamp timestamp
     );
  
    @Query("SELECT bh FROM BorrowHistory bh " +
            "WHERE bh.classroomKey = :classroomKey " +
            "AND bh.borrowTime <= :requestTime " +
            "AND (bh.returnTime IS NULL OR bh.returnTime > :requestTime) " +
            "ORDER BY bh.borrowTime DESC")
     List<BorrowHistory> findHolderAtRequestTime(
         @Param("classroomKey") ClassroomKey classroomKey,
         @Param("requestTime") Timestamp requestTime
     );

     // Keep your existing method for current holder
     @Query("SELECT bh.student FROM BorrowHistory bh " +
            "WHERE bh.classroomKey = :classroomKey " +
            "AND bh.returnTime IS NULL " +
            "ORDER BY bh.borrowTime DESC LIMIT 1")
     Optional<User> findCurrentHolderByClassroomKey(@Param("classroomKey") ClassroomKey classroomKey);
     
   
     
     
    
}

