package com.example.demo.repository;

import com.example.demo.model.User;
import com.example.demo.model.UserOnboarding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserOnboardingRepository extends JpaRepository<UserOnboarding, Long> {

    // Add this method to find onboarding by user
    Optional<UserOnboarding> findByUser(User user);
}
