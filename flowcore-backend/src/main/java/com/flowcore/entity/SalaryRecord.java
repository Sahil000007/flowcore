package com.flowcore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "salary_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @Column(nullable = false)
    private LocalDate payrollDate;

    @Column(nullable = false)
    private Integer daysWorked;

    @Column(nullable = false)
    private Double basicWage;

    private Double overtimeAmount;

    private Double advances;

    private Double deductions;

    @Column(nullable = false)
    private Double netAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private LocalDate paymentDate;

    private String paymentMethod;

    private String remarks;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PaymentStatus {
        PENDING,
        PAID,
        PARTIAL,
        PENDING_APPROVAL
    }
}
