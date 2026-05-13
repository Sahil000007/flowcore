package com.flowcore.repository;

import com.flowcore.entity.SalaryRecord;
import com.flowcore.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, Long> {
    List<SalaryRecord> findByWorker(Worker worker);
    List<SalaryRecord> findByPayrollDateBetween(LocalDate startDate, LocalDate endDate);
    List<SalaryRecord> findByPaymentStatus(SalaryRecord.PaymentStatus status);
}
