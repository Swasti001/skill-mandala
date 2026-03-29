package com.example.demo.controller;

import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class StatusController {
    private final UserRepository userRepository;
    public StatusController(UserRepository userRepository) { this.userRepository = userRepository; }

    @GetMapping("/api/debug/users")
    public Object getUsers() {
        return userRepository.findAll().stream().collect(Collectors.toMap(u -> u.getId().toString(), u -> u.getStatus() != null ? u.getStatus() : "null"));
    }
}
