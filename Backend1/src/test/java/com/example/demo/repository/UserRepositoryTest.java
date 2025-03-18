package com.example.demo.repository;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.demo.model.User;

import java.util.Optional;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByEmail() {
        User user = new User();
        user.setEmail("john.doe@example.com");
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail("john.doe@example.com");
        assertTrue(foundUser.isPresent());
        assertEquals("john.doe@example.com", foundUser.get().getEmail());
    }
}