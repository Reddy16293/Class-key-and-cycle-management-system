package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final OAuth2AuthorizedClientService authorizedClientService;
    private final UserRepository userRepository;
    
    public AuthController(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
		this.userRepository = null;
    }
    @GetMapping("/user")
    public User getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return null; // No user is authenticated
        }

        String email = principal.getAttribute("email"); // Get email from Google OAuth
        Optional<User> user = userRepository.findByEmail(email);

        return user.orElse(null); // Return user if found, otherwise null
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            if (authentication instanceof OAuth2AuthenticationToken) {
                request.getSession().invalidate(); // Invalidate session
            }
            request.logout(); // Perform logout

            // Redirect to Google logout
            response.sendRedirect("https://accounts.google.com/Logout");

            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Logout failed");
        }
    }
}
