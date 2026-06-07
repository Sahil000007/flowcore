package com.flowcore.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flowcore.entity.SalaryRecord;
import com.flowcore.entity.Worker;

@Repository
public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, Long> {
    List<SalaryRecord> findByWorker(Worker worker);

    List<SalaryRecord> findByPayrollDate(LocalDate payrollDate);

    List<SalaryRecord> findByPayrollDateBetween(LocalDate startDate, LocalDate endDate);

    List<SalaryRecord> findByPaymentStatus(SalaryRecord.PaymentStatus status);
}
