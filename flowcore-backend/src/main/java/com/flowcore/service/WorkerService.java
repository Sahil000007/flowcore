package com.flowcore.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flowcore.entity.Worker;
import com.flowcore.repository.WorkerRepository;

@Service
public class WorkerService {

    @Autowired
    private WorkerRepository workerRepository;

    public Worker createWorker(Worker worker) {
        if (workerRepository.existsByPhone(worker.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        if (worker.getAadhaarId() != null && workerRepository.existsByAadhaarId(worker.getAadhaarId())) {
            throw new IllegalArgumentException("Aadhaar ID already exists");
        }
        worker.setCreatedAt(LocalDateTime.now());
        worker.setUpdatedAt(LocalDateTime.now());
        return workerRepository.save(worker);
    }

    public Worker updateWorker(Long id, Worker workerDetails) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found"));

        if (!worker.getPhone().equals(workerDetails.getPhone()) &&
                workerRepository.existsByPhone(workerDetails.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        worker.setName(workerDetails.getName());
        worker.setSkill(workerDetails.getSkill());
        worker.setDailyWage(workerDetails.getDailyWage());
        worker.setEmergencyContact(workerDetails.getEmergencyContact());
        worker.setEmergencyPhone(workerDetails.getEmergencyPhone());
        worker.setActive(workerDetails.getActive());
        worker.setNotes(workerDetails.getNotes());
        worker.setUpdatedAt(LocalDateTime.now());
        return workerRepository.save(worker);
    }

    public Optional<Worker> getWorkerById(Long id) {
        return workerRepository.findById(id);
    }

    public Optional<Worker> getWorkerByPhone(String phone) {
        return workerRepository.findByPhone(phone);
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public List<Worker> getActiveWorkers() {
        return workerRepository.findByActiveTrue();
    }

    public List<Worker> getWorkersBySkill(String skill) {
        return workerRepository.findBySkill(skill);
    }

    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }

    public Worker deactivateWorker(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found"));
        worker.setActive(false);
        worker.setUpdatedAt(LocalDateTime.now());
        return workerRepository.save(worker);
    }
}
