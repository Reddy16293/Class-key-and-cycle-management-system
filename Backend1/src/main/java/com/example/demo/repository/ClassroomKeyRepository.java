package com.example.demo.repository;

import com.example.demo.model.ClassroomKey;
import com.example.demo.model.KeyRequest;
import com.example.demo.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassroomKeyRepository extends JpaRepository<ClassroomKey, Long> {
	List<ClassroomKey> findByIsAvailable(int isAvailable);
	List<ClassroomKey> findTop5ByOrderByIdDesc();
	 boolean existsByBlockNameAndClassroomName(String blockName, String classroomName);
	 @Query("SELECT c FROM ClassroomKey c WHERE LOWER(TRIM(c.blockName)) = LOWER(TRIM(:blockName)) AND LOWER(TRIM(c.classroomName)) = LOWER(TRIM(:classroomName))")
	 Optional<ClassroomKey> findByBlockNameAndClassroomName(@Param("blockName") String blockName, @Param("classroomName") String classroomName);
    
	  List<ClassroomKey> findByBlockNameAndFloorAndIsAvailable(String blockName, String floor, int isAvailable);
	  List<ClassroomKey> findByBlockNameAndFloor(String blockName, String floor);
	  Optional<ClassroomKey> findById(Long id);
	  
	  @Query("SELECT ck FROM ClassroomKey ck JOIN BorrowHistory bh ON ck.id = bh.classroomKey.id " +
		       "WHERE bh.student = :user AND bh.returnTime IS NULL")
		List<ClassroomKey> findByCurrentHolder(@Param("user") User user);
	 
}