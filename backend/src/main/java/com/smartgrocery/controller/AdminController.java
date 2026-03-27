package com.smartgrocery.controller;

import com.smartgrocery.model.User;
import com.smartgrocery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        List<User> buyers = userRepository.findAll()
            .stream()
            .filter(u -> "BUYER".equals(u.getRole()))
            .peek(u -> u.setPassword(null)) // Hide passwords
            .toList();
        return ResponseEntity.ok(buyers);
    }
}
