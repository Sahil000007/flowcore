package com.flowcore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDTO {
    private Long id;
    private String name;
    private String phone;
    private String skill;
    private String aadhaarId;
    private Double dailyWage;
    private LocalDate joiningDate;
    private String emergencyContact;
    private String emergencyPhone;
    private Boolean active;
    private String notes;
}
