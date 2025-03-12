package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User1 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private String email;

    // for coordinator only this exists
    // for all others it is null
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role userRole;

    private boolean enabled = true;

    // For student-supervisor mapping
    @ManyToOne
    @JoinColumn(name = "supervisor_id")
    private User1 supervisor;

    public User1(String email, String password, Role role){
        this.email = email;
        this.password = password;
        this.userRole = role;
    }
    public User1(String email, Role role) {
        this.email = email;
        this.userRole = role;
    }

    public Role getUserRole() {
        System.out.println("we are entering here ig getUserRole");
        return userRole;
    }
}