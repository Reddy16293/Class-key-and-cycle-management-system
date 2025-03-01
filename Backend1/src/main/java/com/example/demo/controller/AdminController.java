package com.example.demo.controller;

import com.example.demo.model.Admin;
import com.example.demo.service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private IAdminService adminService;

    @PostMapping("/signup")
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.createAdmin(admin);  // Admin signup (registration)
    }

    @PostMapping("/login")
    public Admin loginAdmin(@RequestBody Admin admin) {
        Admin loggedInAdmin = adminService.loginAdmin(admin.getUsername(), admin.getPassword());
        if (loggedInAdmin != null) {
            return loggedInAdmin;  // Return logged-in admin details
        } else {
            throw new RuntimeException("Invalid username or password");
        }
    }
}
