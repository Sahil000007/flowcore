package com.flowcore.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flowcore.entity.SalaryRecord;
import com.flowcore.entity.Worker;
import com.flowcore.repository.SalaryRecordRepository;

@Service
@Transactional
public class SalaryService {

    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    public SalaryRecord createSalary(SalaryRecord salary) {
        salary.setCreatedAt(LocalDateTime.now());
        salary.setUpdatedAt(LocalDateTime.now());
        return salaryRecordRepository.save(salary);
    }

    public SalaryRecord updateSalary(Long id, SalaryRecord salaryDetails) {
        SalaryRecord salary = salaryRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Salary record not found"));

        salary.setDaysWorked(salaryDetails.getDaysWorked());
        salary.setBasicWage(salaryDetails.getBasicWage());
        salary.setAdvances(salaryDetails.getAdvances());
        salary.setDeductions(salaryDetails.getDeductions());
        salary.setNetAmount(salaryDetails.getNetAmount());
        salary.setPaymentStatus(salaryDetails.getPaymentStatus());
        salary.setPaymentMethod(salaryDetails.getPaymentMethod());
        salary.setBankAccount(salaryDetails.getBankAccount());
        salary.setIfsc(salaryDetails.getIfsc());
        salary.setUpiId(salaryDetails.getUpiId());
        salary.setPaymentReference(salaryDetails.getPaymentReference());
        salary.setRemarks(salaryDetails.getRemarks());
        salary.setUpdatedAt(LocalDateTime.now());
        return salaryRecordRepository.save(salary);
    }

    public Optional<SalaryRecord> getSalaryById(Long id) {
        return salaryRecordRepository.findById(id);
    }

    public List<SalaryRecord> getAllSalaries() {
        return salaryRecordRepository.findAll();
    }

    public List<SalaryRecord> getSalariesByWorker(Worker worker) {
        return salaryRecordRepository.findByWorker(worker);
    }

    public void deleteSalary(Long id) {
        salaryRecordRepository.deleteById(id);
    }
}
