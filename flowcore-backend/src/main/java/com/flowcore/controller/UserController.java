package com.flowcore.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowcore.dto.ApiResponse;
import com.flowcore.entity.User;
import com.flowcore.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails principal) {
        return getUser(principal).map(user -> ResponseEntity.ok(new ApiResponse(true, "Profile retrieved", toProfile(user))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "User not found")));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails principal, @RequestBody Map<String, String> request) {
        return getUser(principal).map(user -> {
            String email = request.getOrDefault("email", "").trim();
            String firstName = request.getOrDefault("firstName", "").trim();
            String lastName = request.getOrDefault("lastName", "").trim();
            if (email.isEmpty() || firstName.isEmpty() || lastName.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Email, first name, and last name are required"));
            }
            userRepository.findByEmail(email).filter(existing -> !existing.getId().equals(user.getId()))
                    .ifPresent(existing -> { throw new IllegalArgumentException("Email already exists"); });
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            User saved = userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "Profile updated", toProfile(saved)));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "User not found")));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails principal, @RequestBody Map<String, String> request) {
        return getUser(principal).map(user -> {
            String current = request.getOrDefault("currentPassword", "");
            String next = request.getOrDefault("newPassword", "");
            if (!passwordEncoder.matches(current, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "Current password is incorrect"));
            }
            if (next.length() < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "New password must be at least 8 characters"));
            }
            user.setPassword(passwordEncoder.encode(next));
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "User not found")));
    }

    private java.util.Optional<User> getUser(UserDetails principal) {
        return principal == null ? java.util.Optional.empty() : userRepository.findByUsername(principal.getUsername());
    }

    private Map<String, Object> toProfile(User user) {
        return Map.of("id", user.getId(), "username", user.getUsername(), "email", user.getEmail(),
                "firstName", user.getFirstName(), "lastName", user.getLastName(), "role", user.getRole().name());
    }
}
