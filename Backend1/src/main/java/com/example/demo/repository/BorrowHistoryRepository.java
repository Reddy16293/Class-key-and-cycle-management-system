package com.example.demo.repository;

import com.example.demo.model.BorrowHistory;
import com.example.demo.model.ClassroomKey;
import com.example.demo.model.User;

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

