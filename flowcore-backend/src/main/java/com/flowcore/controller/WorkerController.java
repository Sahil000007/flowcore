package com.flowcore.controller;

import com.flowcore.dto.ApiResponse;
import com.flowcore.dto.WorkerDTO;
import com.flowcore.entity.Worker;
import com.flowcore.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class WorkerController {

    @Autowired
    private WorkerRepository workerRepository;

    @GetMapping
    public ResponseEntity<?> getAllWorkers() {
        try {
            List<Worker> workers = workerRepository.findAll();
            List<WorkerDTO> workerDTOs = workers.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Workers retrieved successfully", workerDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving workers: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkerById(@PathVariable Long id) {
        return workerRepository.findById(id)
                .map(worker -> ResponseEntity.ok(new ApiResponse(true, "Worker retrieved", convertToDTO(worker))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Worker not found")));
    }

    @PostMapping
    public ResponseEntity<?> createWorker(@RequestBody WorkerDTO workerDTO) {
        try {
            Worker worker = convertToEntity(workerDTO);
            Worker savedWorker = workerRepository.save(worker);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Worker created successfully", convertToDTO(savedWorker)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error creating worker: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorker(@PathVariable Long id, @RequestBody WorkerDTO workerDTO) {
        return workerRepository.findById(id)
                .map(worker -> {
                    worker.setName(workerDTO.getName());
                    worker.setPhone(workerDTO.getPhone());
                    worker.setSkill(workerDTO.getSkill());
                    worker.setDailyWage(workerDTO.getDailyWage());
                    worker.setEmergencyContact(workerDTO.getEmergencyContact());
                    worker.setEmergencyPhone(workerDTO.getEmergencyPhone());
                    worker.setActive(workerDTO.getActive());
                    worker.setNotes(workerDTO.getNotes());
                    Worker updatedWorker = workerRepository.save(worker);
                    return ResponseEntity.ok(new ApiResponse(true, "Worker updated successfully", convertToDTO(updatedWorker)));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Worker not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorker(@PathVariable Long id) {
        return workerRepository.findById(id)
                .map(worker -> {
                    workerRepository.deleteById(id);
                    return ResponseEntity.ok(new ApiResponse(true, "Worker deleted successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Worker not found")));
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<?> getWorkersBySkill(@PathVariable String skill) {
        try {
            List<Worker> workers = workerRepository.findBySkill(skill);
            List<WorkerDTO> workerDTOs = workers.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Workers retrieved", workerDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving workers"));
        }
    }

    private WorkerDTO convertToDTO(Worker worker) {
        WorkerDTO dto = new WorkerDTO();
        dto.setId(worker.getId());
        dto.setName(worker.getName());
        dto.setPhone(worker.getPhone());
        dto.setSkill(worker.getSkill());
        dto.setAadhaarId(worker.getAadhaarId());
        dto.setDailyWage(worker.getDailyWage());
        dto.setJoiningDate(worker.getJoiningDate());
        dto.setEmergencyContact(worker.getEmergencyContact());
        dto.setEmergencyPhone(worker.getEmergencyPhone());
        dto.setActive(worker.getActive());
        dto.setNotes(worker.getNotes());
        return dto;
    }

    private Worker convertToEntity(WorkerDTO dto) {
        Worker worker = new Worker();
        worker.setName(dto.getName());
        worker.setPhone(dto.getPhone());
        worker.setSkill(dto.getSkill());
        worker.setAadhaarId(dto.getAadhaarId());
        worker.setDailyWage(dto.getDailyWage());
        worker.setJoiningDate(dto.getJoiningDate());
        worker.setEmergencyContact(dto.getEmergencyContact());
        worker.setEmergencyPhone(dto.getEmergencyPhone());
        worker.setActive(true);
        worker.setNotes(dto.getNotes());
        return worker;
    }
}
