package com.flowcore.repository;

import com.flowcore.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByPhone(String phone);
    Optional<Worker> findByAadhaarId(String aadhaarId);
    List<Worker> findByActive(Boolean active);
    List<Worker> findBySkill(String skill);
}
