package com.flowcore.repository;

import com.flowcore.entity.Attendance;
import com.flowcore.entity.Worker;
import com.flowcore.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByWorkerAndAttendanceDateBetween(Worker worker, LocalDate startDate, LocalDate endDate);
    List<Attendance> findBySiteAndAttendanceDateBetween(Site site, LocalDate startDate, LocalDate endDate);
    Optional<Attendance> findByWorkerAndAttendanceDateAndSite(Worker worker, LocalDate date, Site site);
    List<Attendance> findByAttendanceDateAndSite(LocalDate date, Site site);
}
