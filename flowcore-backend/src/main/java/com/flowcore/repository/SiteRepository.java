package com.flowcore.repository;

import com.flowcore.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
    List<Site> findByStatus(Site.SiteStatus status);
    List<Site> findByClientName(String clientName);
}
