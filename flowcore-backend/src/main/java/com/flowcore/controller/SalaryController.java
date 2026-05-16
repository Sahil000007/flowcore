package com.flowcore.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
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
import com.flowcore.dto.SalaryDTO;
import com.flowcore.entity.SalaryRecord;
import com.flowcore.entity.Worker;
import com.flowcore.repository.SalaryRecordRepository;
import com.flowcore.repository.WorkerRepository;

@RestController
@RequestMapping("/api/salary")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class SalaryController {

    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @GetMapping
    public ResponseEntity<?> getAllSalaries() {
        try {
            List<SalaryRecord> salaries = salaryRecordRepository.findAll();
            List<SalaryDTO> salaryDTOs = salaries.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Salaries retrieved successfully", salaryDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving salaries: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSalaryById(@PathVariable Long id) {
        return salaryRecordRepository.findById(id)
                .map(salary -> ResponseEntity.ok(new ApiResponse(true, "Salary retrieved", convertToDTO(salary))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Salary record not found")));
    }

    @PostMapping
    public ResponseEntity<?> createSalary(@RequestBody SalaryDTO salaryDTO) {
        try {
            Worker worker = workerRepository.findById(salaryDTO.getWorkerId())
                    .orElseThrow(() -> new IllegalArgumentException("Worker not found"));

            SalaryRecord salary = convertToEntity(salaryDTO, worker);

            // Calculate net amount
            Double totalDeductions = (salaryDTO.getAdvance() != null ? salaryDTO.getAdvance() : 0) +
                    (salaryDTO.getDeduction() != null ? salaryDTO.getDeduction() : 0);
            Double netAmount = (salaryDTO.getTotalWage() != null ? salaryDTO.getTotalWage() : 0) - totalDeductions;
            salary.setNetAmount(Math.max(0, netAmount));

            SalaryRecord savedSalary = salaryRecordRepository.save(salary);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Salary record created successfully", convertToDTO(savedSalary)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error creating salary record: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSalary(@PathVariable Long id, @RequestBody SalaryDTO salaryDTO) {
        return salaryRecordRepository.findById(id)
                .map(salary -> {
                    try {
                        if (salaryDTO.getDaysWorked() != null) {
                            salary.setDaysWorked(salaryDTO.getDaysWorked());
                        }
                        if (salaryDTO.getTotalWage() != null) {
                            salary.setBasicWage(salaryDTO.getTotalWage());
                        }
                        if (salaryDTO.getAdvance() != null) {
                            salary.setAdvances(salaryDTO.getAdvance());
                        }
                        if (salaryDTO.getDeduction() != null) {
                            salary.setDeductions(salaryDTO.getDeduction());
                        }
                        if (salaryDTO.getStatus() != null) {
                            salary.setPaymentStatus(SalaryRecord.PaymentStatus.valueOf(salaryDTO.getStatus()));
                        }
                        if (salaryDTO.getRemarks() != null) {
                            salary.setRemarks(salaryDTO.getRemarks());
                        }

                        // Recalculate net amount
                        Double totalDeductions = (salary.getAdvances() != null ? salary.getAdvances() : 0) +
                                (salary.getDeductions() != null ? salary.getDeductions() : 0);
                        Double netAmount = (salary.getBasicWage() != null ? salary.getBasicWage() : 0)
                                - totalDeductions;
                        salary.setNetAmount(Math.max(0, netAmount));

                        SalaryRecord updatedSalary = salaryRecordRepository.save(salary);
                        return ResponseEntity.ok(new ApiResponse(true, "Salary record updated successfully",
                                convertToDTO(updatedSalary)));
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(new ApiResponse(false, "Error updating salary record: " + e.getMessage()));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Salary record not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSalary(@PathVariable Long id) {
        return salaryRecordRepository.findById(id)
                .map(salary -> {
                    salaryRecordRepository.deleteById(id);
                    return ResponseEntity.ok(new ApiResponse(true, "Salary record deleted successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Salary record not found")));
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<?> getSalariesByWorker(@PathVariable Long workerId) {
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new IllegalArgumentException("Worker not found"));

            List<SalaryRecord> salaries = salaryRecordRepository.findByWorker(worker);
            List<SalaryDTO> salaryDTOs = salaries.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Worker salaries retrieved", salaryDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error retrieving salaries: " + e.getMessage()));
        }
    }

    @GetMapping("/report")
    public ResponseEntity<?> getSalaryReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            List<SalaryRecord> salaries = salaryRecordRepository.findByPayrollDateBetween(start, end);
            List<SalaryDTO> salaryDTOs = salaries.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Salary report retrieved", salaryDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error retrieving salary report: " + e.getMessage()));
        }
    }

    private SalaryDTO convertToDTO(SalaryRecord salary) {
        SalaryDTO dto = new SalaryDTO();
        dto.setId(salary.getId());
        dto.setWorkerId(salary.getWorker() != null ? salary.getWorker().getId() : null);

        // Convert payrollDate to month format (YYYY-MM)
        if (salary.getPayrollDate() != null) {
            dto.setMonth(salary.getPayrollDate().getYear() + "-" +
                    String.format("%02d", salary.getPayrollDate().getMonthValue()));
        }

        dto.setDaysWorked(salary.getDaysWorked());
        dto.setTotalWage(salary.getBasicWage());
        dto.setAdvance(salary.getAdvances());
        dto.setDeduction(salary.getDeductions());
        dto.setNetAmount(salary.getNetAmount());
        dto.setStatus(salary.getPaymentStatus() != null ? salary.getPaymentStatus().toString() : "PENDING");
        dto.setRemarks(salary.getRemarks());

        return dto;
    }

    private SalaryRecord convertToEntity(SalaryDTO dto, Worker worker) {
        SalaryRecord salary = new SalaryRecord();
        salary.setWorker(worker);

        // Parse month format (YYYY-MM) to LocalDate (first day of month)
        if (dto.getMonth() != null) {
            YearMonth yearMonth = YearMonth.parse(dto.getMonth());
            salary.setPayrollDate(yearMonth.atDay(1));
        } else {
            salary.setPayrollDate(LocalDate.now());
        }

        salary.setDaysWorked(dto.getDaysWorked() != null ? dto.getDaysWorked() : 0);
        salary.setBasicWage(dto.getTotalWage() != null ? dto.getTotalWage() : 0);
        salary.setAdvances(dto.getAdvance() != null ? dto.getAdvance() : 0);
        salary.setDeductions(dto.getDeduction() != null ? dto.getDeduction() : 0);

        // Set payment status based on input
        String status = dto.getStatus() != null ? dto.getStatus() : "PENDING";
        try {
            salary.setPaymentStatus(SalaryRecord.PaymentStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            salary.setPaymentStatus(SalaryRecord.PaymentStatus.PENDING);
        }

        salary.setRemarks(dto.getRemarks());

        return salary;
    }
}
