package com.flowcore.repository;

import com.flowcore.entity.WorkerAssignment;
import com.flowcore.entity.Worker;
import com.flowcore.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerAssignmentRepository extends JpaRepository<WorkerAssignment, Long> {
    List<WorkerAssignment> findByWorker(Worker worker);
    List<WorkerAssignment> findBySite(Site site);
    List<WorkerAssignment> findByStatus(WorkerAssignment.AssignmentStatus status);
    List<WorkerAssignment> findByWorkerAndStatus(Worker worker, WorkerAssignment.AssignmentStatus status);
}
