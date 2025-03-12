package com.example.demo.repository;

import com.example.demo.model.Bicycle;
import com.example.demo.model.ClassroomKey;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BicycleRepository extends JpaRepository<Bicycle, Long> {
    List<Bicycle> findByIsAvailable(boolean isAvailable);
    boolean existsByQrCode(String qrCode);
    List<Bicycle> findTop5ByOrderByIdDesc();
}
