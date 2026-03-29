package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CheckUserStatus implements CommandLineRunner {
    private final UserRepository userRepository;

    public CheckUserStatus(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        userRepository.findById(66L).ifPresent(user -> {
            System.out.println("USER_66_STATUS:" + user.getStatus());
        });
    }
}
