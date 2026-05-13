package com.flowcore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "sites")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Site {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String projectName;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private Double budget;

    @Column(nullable = false)
    private Integer totalWorkers;

    private String supervisorName;

    private String supervisorPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SiteStatus status = SiteStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(length = 500)
    private String description;

    public enum SiteStatus {
        ACTIVE,
        COMPLETED,
        ON_HOLD,
        CANCELLED
    }
}
