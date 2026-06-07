package com.flowcore.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flowcore.entity.SalaryRecord;
import com.flowcore.entity.Worker;
import com.flowcore.repository.SalaryRecordRepository;

@Service
public class SalaryRecordService {

    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    public SalaryRecord createSalaryRecord(SalaryRecord salaryRecord) {
        // Calculate net amount
        Double totalDeductions = (salaryRecord.getAdvances() != null ? salaryRecord.getAdvances() : 0) +
                (salaryRecord.getDeductions() != null ? salaryRecord.getDeductions() : 0);

        Double totalEarnings = salaryRecord.getBasicWage() +
                (salaryRecord.getOvertimeAmount() != null ? salaryRecord.getOvertimeAmount() : 0);

        salaryRecord.setNetAmount(totalEarnings - totalDeductions);
        salaryRecord.setCreatedAt(LocalDateTime.now());
        salaryRecord.setUpdatedAt(LocalDateTime.now());
        return salaryRecordRepository.save(salaryRecord);
    }

    public SalaryRecord updateSalaryRecord(Long id, SalaryRecord recordDetails) {
        SalaryRecord record = salaryRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Salary record not found"));

        record.setDaysWorked(recordDetails.getDaysWorked());
        record.setBasicWage(recordDetails.getBasicWage());
        record.setOvertimeAmount(recordDetails.getOvertimeAmount());
        record.setAdvances(recordDetails.getAdvances());
        record.setDeductions(recordDetails.getDeductions());
        record.setPaymentStatus(recordDetails.getPaymentStatus());
        record.setPaymentDate(recordDetails.getPaymentDate());
        record.setPaymentMethod(recordDetails.getPaymentMethod());
        record.setRemarks(recordDetails.getRemarks());

        // Recalculate net amount
        Double totalDeductions = (record.getAdvances() != null ? record.getAdvances() : 0) +
                (record.getDeductions() != null ? record.getDeductions() : 0);
        Double totalEarnings = record.getBasicWage() +
                (record.getOvertimeAmount() != null ? record.getOvertimeAmount() : 0);
        record.setNetAmount(totalEarnings - totalDeductions);

        record.setUpdatedAt(LocalDateTime.now());
        return salaryRecordRepository.save(record);
    }

    public Optional<SalaryRecord> getSalaryRecordById(Long id) {
        return salaryRecordRepository.findById(id);
    }

    public List<SalaryRecord> getWorkerSalaryRecords(Worker worker) {
        return salaryRecordRepository.findByWorker(worker);
    }

    public List<SalaryRecord> getSalaryRecordsByMonth(LocalDate payrollDate) {
        return salaryRecordRepository.findByPayrollDate(payrollDate);
    }

    public List<SalaryRecord> getPendingPayments() {
        return salaryRecordRepository.findByPaymentStatus(SalaryRecord.PaymentStatus.PENDING);
    }

    public List<SalaryRecord> getAllSalaryRecords() {
        return salaryRecordRepository.findAll();
    }

    public void deleteSalaryRecord(Long id) {
        salaryRecordRepository.deleteById(id);
    }

    public SalaryRecord markAsPaid(Long id, LocalDate paymentDate, String paymentMethod) {
        SalaryRecord record = salaryRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Salary record not found"));
        record.setPaymentStatus(SalaryRecord.PaymentStatus.PAID);
        record.setPaymentDate(paymentDate);
        record.setPaymentMethod(paymentMethod);
        record.setUpdatedAt(LocalDateTime.now());
        return salaryRecordRepository.save(record);
    }

    public Double getTotalPayable(Worker worker, LocalDate startDate, LocalDate endDate) {
        List<SalaryRecord> records = getWorkerSalaryRecords(worker);
        return records.stream()
                .filter(r -> !r.getPayrollDate().isBefore(startDate) && !r.getPayrollDate().isAfter(endDate))
                .mapToDouble(SalaryRecord::getNetAmount)
                .sum();
    }
}
