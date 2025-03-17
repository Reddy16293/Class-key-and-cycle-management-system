package com.example.demo.repository;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.demo.model.ClassroomKey;

import java.util.List;

@DataJpaTest
public class ClassroomKeyRepositoryTest {

    @Autowired
    private ClassroomKeyRepository classroomKeyRepository;

    @Test
    public void testFindByIsAvailable() {
        ClassroomKey key = new ClassroomKey();
        key.setIsAvailable(1);
        classroomKeyRepository.save(key);

        List<ClassroomKey> availableKeys = classroomKeyRepository.findByIsAvailable(1);
        assertFalse(availableKeys.isEmpty());
    }
}