package com.flowcore.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.flowcore.entity.User;
import com.flowcore.entity.User.UserRole;
import com.flowcore.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${ADMIN_INITIAL_PASSWORD:}")
    private String initialAdminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername("admin")) {
            return;
        }
        if (initialAdminPassword == null || initialAdminPassword.isBlank()) {
            throw new IllegalStateException("Set ADMIN_INITIAL_PASSWORD to create the initial admin account");
        }

        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword(passwordEncoder.encode(initialAdminPassword));
        adminUser.setEmail("admin@flowcore.com");
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setRole(UserRole.ADMIN);
        adminUser.setActive(true);
        userRepository.save(adminUser);
    }
}
