package com.flowcore.config;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    public void run(String... args) throws Exception {

        // Initialize test users if they don't exist
        initializeTestUsers();
    }

    private void initializeTestUsers() {

        // Create ADMIN user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setEmail("admin@flowcore.com");
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setRole(UserRole.ADMIN);
            adminUser.setActive(true);
            userRepository.save(adminUser);
            System.out.println("✅ Created ADMIN user: admin / admin123");
        }

        // Create SUPERVISOR user if not exists
        if (!userRepository.existsByUsername("supervisor")) {
            User supervisorUser = new User();
            supervisorUser.setUsername("supervisor");
            supervisorUser.setPassword(passwordEncoder.encode("supervisor123"));
            supervisorUser.setEmail("supervisor@flowcore.com");
            supervisorUser.setFirstName("Supervisor");
            supervisorUser.setLastName("User");
            supervisorUser.setRole(UserRole.SUPERVISOR);
            supervisorUser.setActive(true);
            userRepository.save(supervisorUser);
            System.out.println("✅ Created SUPERVISOR user: supervisor / supervisor123");
        }

        // Create CONTRACTOR user if not exists
        if (!userRepository.existsByUsername("contractor")) {
            User contractorUser = new User();
            contractorUser.setUsername("contractor");
            contractorUser.setPassword(passwordEncoder.encode("contractor123"));
            contractorUser.setEmail("contractor@flowcore.com");
            contractorUser.setFirstName("Contractor");
            contractorUser.setLastName("User");
            contractorUser.setRole(UserRole.CONTRACTOR);
            contractorUser.setActive(true);
            userRepository.save(contractorUser);
            System.out.println("✅ Created CONTRACTOR user: contractor / contractor123");
        }

        // Create WORKER user if not exists
        if (!userRepository.existsByUsername("worker")) {
            User workerUser = new User();
            workerUser.setUsername("worker");
            workerUser.setPassword(passwordEncoder.encode("worker123"));
            workerUser.setEmail("worker@flowcore.com");
            workerUser.setFirstName("Worker");
            workerUser.setLastName("User");
            workerUser.setRole(UserRole.WORKER);
            workerUser.setActive(true);
            userRepository.save(workerUser);
            System.out.println("✅ Created WORKER user: worker / worker123");
        }

        System.out.println("✅ Data initialization completed");
    }
}
