package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    
    private String email;
    
    @Column(nullable = true)
    private String userName;

    private String picture;

    @Column(nullable = false)
    private String role; // Role: ADMIN, CR, NON_CR

    private String password; // Only for ADMIN authentication
     
    @Column(nullable = false)
    private Boolean enabled = true; // Default value
    // Default Constructor
    public User() {
    }

    // Parameterized Constructor
    public User(Long id, String name, String userName, String picture, String role, String password, String email) {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.picture = picture;
        this.role = role;
        this.password = password;
        this.email=email;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getUserName() { return userName; }
    public String getPicture() { return picture; }
    public String getRole() { return role; }
    public String getPassword() { return password; }
    public String getEmail() {return email;}

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setPicture(String picture) { this.picture = picture; }
    public void setRole(String role) { this.role = role; }
    public void setPassword(String password) { this.password = password; }
    public void setEmail(String email) {this.email=email;}
}
