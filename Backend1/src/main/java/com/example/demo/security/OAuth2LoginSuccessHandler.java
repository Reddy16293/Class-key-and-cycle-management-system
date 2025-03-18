package com.example.demo.security;

import com.example.demo.model.User;  // Use User, not Fake
import com.example.demo.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        // Fetch or create user
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();  // Use User, not Fake
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPicture(picture);
            newUser.setPassword(""); 
            newUser.setRole("NON_CR");  // Default role
            return userRepository.save(newUser);
        });

        // Redirect based on user role
        switch (user.getRole()) {
            case "CR":
                response.sendRedirect("http://localhost:5173/dashboard/student");
                break;
            default:
                response.sendRedirect("http://localhost:5173/dashboard/student");
        }
    }
}
