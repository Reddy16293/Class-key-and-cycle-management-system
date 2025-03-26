package com.example.demo.repository;

import com.example.demo.model.Bicycle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BicycleRepository extends JpaRepository<Bicycle, Long> {
    List<Bicycle> findByIsAvailable(boolean isAvailable);
    List<Bicycle> findByLocationAndIsAvailable(String location, boolean isAvailable);
    boolean existsByQrCode(String qrCode);
    List<Bicycle> findTop5ByOrderByIdDesc();
    List<Bicycle> findByLocation(String location);
    Optional<Bicycle> findByQrCode(String qrCode);
 
}