package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fake")
public class Fake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String picture;

    @Column(nullable = false)
    private String role; // Role: ADMIN, CR, NON_CR

    private String password; // Only for ADMIN authentication

    // Default Constructor
    public Fake() {
    }

    // Parameterized Constructor
    public Fake(Long id, String name, String email, String picture, String role, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.role = role;
        this.password = password;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPicture() { return picture; }
    public String getRole() { return role; }
    public String getPassword() { return password; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPicture(String picture) { this.picture = picture; }
    public void setRole(String role) { this.role = role; }
    public void setPassword(String password) { this.password = password; }
}
