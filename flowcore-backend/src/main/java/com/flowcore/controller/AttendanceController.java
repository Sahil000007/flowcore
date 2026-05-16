package com.flowcore.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flowcore.dto.ApiResponse;
import com.flowcore.dto.AttendanceDTO;
import com.flowcore.entity.Attendance;
import com.flowcore.entity.Site;
import com.flowcore.entity.Worker;
import com.flowcore.repository.AttendanceRepository;
import com.flowcore.repository.SiteRepository;
import com.flowcore.repository.WorkerRepository;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private SiteRepository siteRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Attendance> list = attendanceRepository.findAll();
            List<AttendanceDTO> dtos = list.stream().map(this::toDTO).collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Attendance retrieved successfully", dtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving attendance: " + e.getMessage()));
        }
    }

    @GetMapping("/by-worker")
    public ResponseEntity<?> getByWorkerAndDateRange(
            @RequestParam Long workerId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new IllegalArgumentException("Worker not found"));

            List<Attendance> list = attendanceRepository.findByWorkerAndAttendanceDateBetween(worker, startDate,
                    endDate);
            List<AttendanceDTO> dtos = list.stream().map(this::toDTO).collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Attendance retrieved", dtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error retrieving attendance: " + e.getMessage()));
        }
    }

    @GetMapping("/by-site")
    public ResponseEntity<?> getBySiteAndDateRange(
            @RequestParam Long siteId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            Site site = siteRepository.findById(siteId)
                    .orElseThrow(() -> new IllegalArgumentException("Site not found"));

            List<Attendance> list = attendanceRepository.findBySiteAndAttendanceDateBetween(site, startDate, endDate);
            List<AttendanceDTO> dtos = list.stream().map(this::toDTO).collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Attendance retrieved", dtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error retrieving attendance: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AttendanceDTO dto) {
        try {
            Attendance attendance = toEntity(dto);
            Attendance saved = attendanceRepository.save(attendance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Attendance created successfully", toDTO(saved)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error creating attendance: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AttendanceDTO dto) {
        Optional<Attendance> existingOpt = attendanceRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Attendance not found"));
        }

        try {
            Attendance existing = existingOpt.get();
            Attendance updated = merge(existing, dto);
            Attendance saved = attendanceRepository.save(updated);
            return ResponseEntity.ok(new ApiResponse(true, "Attendance updated successfully", toDTO(saved)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error updating attendance: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Attendance> existingOpt = attendanceRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Attendance not found"));
        }

        attendanceRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Attendance deleted successfully"));
    }

    private AttendanceDTO toDTO(Attendance a) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(a.getId());
        dto.setWorkerId(a.getWorker() != null ? a.getWorker().getId() : null);
        dto.setSiteId(a.getSite() != null ? a.getSite().getId() : null);
        dto.setAttendanceDate(a.getAttendanceDate());
        dto.setStatus(a.getStatus());
        dto.setHoursWorked(a.getHoursWorked());
        dto.setOvertimeHours(a.getOvertimeHours());
        dto.setRemarks(a.getRemarks());
        return dto;
    }

    private Attendance toEntity(AttendanceDTO dto) {
        Attendance attendance = new Attendance();
        if (dto.getWorkerId() == null || dto.getSiteId() == null) {
            throw new IllegalArgumentException("workerId and siteId are required");
        }

        Worker worker = workerRepository.findById(dto.getWorkerId())
                .orElseThrow(() -> new IllegalArgumentException("Worker not found"));

        Site site = siteRepository.findById(dto.getSiteId())
                .orElseThrow(() -> new IllegalArgumentException("Site not found"));

        attendance.setWorker(worker);
        attendance.setSite(site);
        attendance.setAttendanceDate(dto.getAttendanceDate());
        attendance.setStatus(dto.getStatus());
        attendance.setHoursWorked(dto.getHoursWorked());
        attendance.setOvertimeHours(dto.getOvertimeHours());
        attendance.setRemarks(dto.getRemarks());
        return attendance;
    }

    private Attendance merge(Attendance existing, AttendanceDTO dto) {
        if (dto.getWorkerId() != null) {
            Worker worker = workerRepository.findById(dto.getWorkerId())
                    .orElseThrow(() -> new IllegalArgumentException("Worker not found"));
            existing.setWorker(worker);
        }
        if (dto.getSiteId() != null) {
            Site site = siteRepository.findById(dto.getSiteId())
                    .orElseThrow(() -> new IllegalArgumentException("Site not found"));
            existing.setSite(site);
        }
        if (dto.getAttendanceDate() != null)
            existing.setAttendanceDate(dto.getAttendanceDate());
        if (dto.getStatus() != null)
            existing.setStatus(dto.getStatus());
        if (dto.getHoursWorked() != null)
            existing.setHoursWorked(dto.getHoursWorked());
        if (dto.getOvertimeHours() != null)
            existing.setOvertimeHours(dto.getOvertimeHours());
        existing.setRemarks(dto.getRemarks());
        return existing;
    }
}
