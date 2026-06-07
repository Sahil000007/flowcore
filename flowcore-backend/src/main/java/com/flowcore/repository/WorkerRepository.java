package com.flowcore.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flowcore.entity.Worker;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByPhone(String phone);

    Optional<Worker> findByAadhaarId(String aadhaarId);

    List<Worker> findByActive(Boolean active);

    List<Worker> findByActiveTrue();

    List<Worker> findBySkill(String skill);

    boolean existsByPhone(String phone);

    boolean existsByAadhaarId(String aadhaarId);
}
