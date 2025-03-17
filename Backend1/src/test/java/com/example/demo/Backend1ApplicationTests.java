package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.demo.controller.AdminController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = Backend1Application.class)  // Explicitly load configuration
class Backend1ApplicationTests {

    @Autowired
    private AdminController controller;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull(); // Ensures Spring Boot loads the Controller
    }
}
