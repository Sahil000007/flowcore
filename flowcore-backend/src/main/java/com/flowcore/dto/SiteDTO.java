package com.flowcore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteDTO {
    private Long id;
    private String projectName;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private String clientName;
    private Double budget;
    private Integer totalWorkers;
    private String supervisorName;
    private String supervisorPhone;
    private String status;
    private String description;
}
