package com.example.demo;

import com.example.demo.controller.AdminController;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.env.Environment;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = Backend1Application.class)
class Backend1ApplicationTests {

    @Autowired
    private AdminController adminController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private Environment env;

    @Test
    void contextLoads() {
        // Ensures Spring Boot loads the application context
    }

    @Test
    void testAdminControllerBean() {
        assertThat(adminController).isNotNull();
    }

    @Test
    void testUserRepositoryBean() {
        assertThat(userRepository).isNotNull();
    }

    @Test
    void testDatabaseConnection() {
        long userCount = userRepository.count();
        assertThat(userCount).isGreaterThanOrEqualTo(0);
    }
}