package com.example.demo.imp;

import com.example.demo.model.Admin;
import com.example.demo.repository.AdminRepository;
import com.example.demo.service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImpl implements IAdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin createAdmin(Admin admin) {
        // Save new admin (Signup)
        return adminRepository.save(admin);
    }

    @Override
    public Admin loginAdmin(String username, String password) {
        // Find admin by username and check password
        Optional<Admin> existingAdmin = adminRepository.findByUsername(username);
        if (existingAdmin.isPresent() && existingAdmin.get().getPassword().equals(password)) {
            return existingAdmin.get();  // Login successful
        } else {
            return null;  // Invalid login credentials
        }
    }
}
