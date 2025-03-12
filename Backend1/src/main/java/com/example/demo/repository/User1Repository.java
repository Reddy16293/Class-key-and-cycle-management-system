package com.example.demo.repository;

import com.example.demo.model.User1;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface User1Repository extends JpaRepository<User1, Long> {
    Optional<User1> findByEmail(String email);
    boolean existsByEmail(String email);

}
