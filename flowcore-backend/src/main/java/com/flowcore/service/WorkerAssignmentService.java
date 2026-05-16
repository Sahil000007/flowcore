package com.flowcore.service;

import com.flowcore.entity.WorkerAssignment;
import com.flowcore.repository.WorkerAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WorkerAssignmentService {

    @Autowired
    private WorkerAssignmentRepository workerAssignmentRepository;

    public WorkerAssignment assignWorker(WorkerAssignment assignment) {
        assignment.setCreatedAt(LocalDateTime.now());
        assignment.setUpdatedAt(LocalDateTime.now());
        return workerAssignmentRepository.save(assignment);
    }

    public WorkerAssignment updateAssignment(Long id, WorkerAssignment assignmentDetails) {
        WorkerAssignment assignment = workerAssignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));
        
        assignment.setStatus(assignmentDetails.getStatus());
        assignment.setCompletionDate(assignmentDetails.getCompletionDate());
        assignment.setRemarks(assignmentDetails.getRemarks());
        assignment.setUpdatedAt(LocalDateTime.now());
        return workerAssignmentRepository.save(assignment);
    }

    public Optional<WorkerAssignment> getAssignmentById(Long id) {
        return workerAssignmentRepository.findById(id);
    }

    public List<WorkerAssignment> getAllAssignments() {
        return workerAssignmentRepository.findAll();
    }

    public List<WorkerAssignment> getActiveAssignments() {
        return workerAssignmentRepository.findByStatus(WorkerAssignment.AssignmentStatus.ACTIVE);
    }

    public List<WorkerAssignment> getAssignmentsByStatus(WorkerAssignment.AssignmentStatus status) {
        return workerAssignmentRepository.findByStatus(status);
    }

    public void deleteAssignment(Long id) {
        workerAssignmentRepository.deleteById(id);
    }

    public WorkerAssignment completeAssignment(Long id) {
        WorkerAssignment assignment = workerAssignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));
        assignment.setStatus(WorkerAssignment.AssignmentStatus.COMPLETED);
        assignment.setUpdatedAt(LocalDateTime.now());
        return workerAssignmentRepository.save(assignment);
    }
}
