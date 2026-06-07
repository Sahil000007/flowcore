package com.flowcore.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flowcore.entity.Attendance;
import com.flowcore.entity.Site;
import com.flowcore.entity.Worker;
import com.flowcore.repository.AttendanceRepository;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public Attendance recordAttendance(Attendance attendance) {
        attendance.setCreatedAt(LocalDateTime.now());
        attendance.setUpdatedAt(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(Long id, Attendance attendanceDetails) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Attendance record not found"));

        attendance.setStatus(attendanceDetails.getStatus());
        attendance.setHoursWorked(attendanceDetails.getHoursWorked());
        attendance.setOvertimeHours(attendanceDetails.getOvertimeHours());
        attendance.setRemarks(attendanceDetails.getRemarks());
        attendance.setUpdatedAt(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    public List<Attendance> getWorkerAttendance(Worker worker, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByWorkerAndAttendanceDateBetween(worker, startDate, endDate);
    }

    public List<Attendance> getSiteAttendance(Site site, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findBySiteAndAttendanceDateBetween(site, startDate, endDate);
    }

    public Optional<Attendance> getAttendanceRecord(Worker worker, LocalDate date, Site site) {
        return attendanceRepository.findByWorkerAndAttendanceDateAndSite(worker, date, site);
    }

    public List<Attendance> getDailyAttendance(LocalDate date, Site site) {
        return attendanceRepository.findByAttendanceDateAndSite(date, site);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    public int getWorkerPresentDays(Worker worker, LocalDate startDate, LocalDate endDate) {
        List<Attendance> records = getWorkerAttendance(worker, startDate, endDate);
        return (int) records.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
    }
}
