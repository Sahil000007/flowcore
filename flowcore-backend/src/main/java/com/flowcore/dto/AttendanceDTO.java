package com.flowcore.dto;

import java.time.LocalDate;

import com.flowcore.entity.Attendance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private Long id;
    private Long workerId;
    private Long siteId;
    private LocalDate attendanceDate;
    private Attendance.AttendanceStatus status;
    private Double hoursWorked;
    private Integer overtimeHours;
    private String remarks;
}
