package com.example.demo.service;

import com.example.demo.model.Admin;

public interface IAdminService {
    Admin createAdmin(Admin admin);  // Signup or Add an admin
    Admin loginAdmin(String username, String password);  // Login admin by username and password
}
