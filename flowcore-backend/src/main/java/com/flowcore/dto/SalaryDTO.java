package com.flowcore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryDTO {
    private Long id;
    private Long workerId;
    private String month; // Format: YYYY-MM
    private Integer daysWorked;
    private Double totalWage;
    private Double advance;
    private Double deduction;
    private Double netAmount;
    private String status; // PENDING, APPROVED, PAID, CANCELLED
    private String remarks;
}
