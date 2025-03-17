package com.example.demo.repository;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.demo.model.Bicycle;

import java.util.List;

@DataJpaTest
public class BicycleRepositoryTest {

    @Autowired
    private BicycleRepository bicycleRepository;

    @Test
    public void testFindByIsAvailable() {
        Bicycle bicycle = new Bicycle();
        bicycle.setAvailable(true);
        bicycleRepository.save(bicycle);

        List<Bicycle> availableBicycles = bicycleRepository.findByIsAvailable(true);
        assertFalse(availableBicycles.isEmpty());
    }
}