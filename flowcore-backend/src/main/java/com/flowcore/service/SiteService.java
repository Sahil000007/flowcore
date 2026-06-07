package com.flowcore.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flowcore.entity.Site;
import com.flowcore.repository.SiteRepository;

@Service
public class SiteService {

    @Autowired
    private SiteRepository siteRepository;

    public Site createSite(Site site) {
        site.setCreatedAt(LocalDateTime.now());
        site.setUpdatedAt(LocalDateTime.now());
        return siteRepository.save(site);
    }

    public Site updateSite(Long id, Site siteDetails) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Site not found"));

        site.setProjectName(siteDetails.getProjectName());
        site.setLocation(siteDetails.getLocation());
        site.setStartDate(siteDetails.getStartDate());
        site.setEndDate(siteDetails.getEndDate());
        site.setClientName(siteDetails.getClientName());
        site.setBudget(siteDetails.getBudget());
        site.setTotalWorkers(siteDetails.getTotalWorkers());
        site.setSupervisorName(siteDetails.getSupervisorName());
        site.setSupervisorPhone(siteDetails.getSupervisorPhone());
        site.setStatus(siteDetails.getStatus());
        site.setDescription(siteDetails.getDescription());
        site.setUpdatedAt(LocalDateTime.now());
        return siteRepository.save(site);
    }

    public Optional<Site> getSiteById(Long id) {
        return siteRepository.findById(id);
    }

    public List<Site> getAllSites() {
        return siteRepository.findAll();
    }

    public List<Site> getActiveSites() {
        return siteRepository.findByStatus(Site.SiteStatus.ACTIVE);
    }

    public List<Site> getSitesByStatus(Site.SiteStatus status) {
        return siteRepository.findByStatus(status);
    }

    public void deleteSite(Long id) {
        siteRepository.deleteById(id);
    }

    public Site completeSite(Long id) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Site not found"));
        site.setStatus(Site.SiteStatus.COMPLETED);
        site.setUpdatedAt(LocalDateTime.now());
        return siteRepository.save(site);
    }
}
