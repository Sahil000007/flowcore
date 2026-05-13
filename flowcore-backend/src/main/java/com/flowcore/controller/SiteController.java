package com.flowcore.controller;

import com.flowcore.dto.ApiResponse;
import com.flowcore.dto.SiteDTO;
import com.flowcore.entity.Site;
import com.flowcore.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SiteController {

    @Autowired
    private SiteRepository siteRepository;

    @GetMapping
    public ResponseEntity<?> getAllSites() {
        try {
            List<Site> sites = siteRepository.findAll();
            List<SiteDTO> siteDTOs = sites.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Sites retrieved successfully", siteDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving sites"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSiteById(@PathVariable Long id) {
        return siteRepository.findById(id)
                .map(site -> ResponseEntity.ok(new ApiResponse(true, "Site retrieved", convertToDTO(site))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Site not found")));
    }

    @PostMapping
    public ResponseEntity<?> createSite(@RequestBody SiteDTO siteDTO) {
        try {
            Site site = convertToEntity(siteDTO);
            Site savedSite = siteRepository.save(site);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Site created successfully", convertToDTO(savedSite)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error creating site: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSite(@PathVariable Long id, @RequestBody SiteDTO siteDTO) {
        return siteRepository.findById(id)
                .map(site -> {
                    site.setProjectName(siteDTO.getProjectName());
                    site.setLocation(siteDTO.getLocation());
                    site.setClientName(siteDTO.getClientName());
                    site.setBudget(siteDTO.getBudget());
                    site.setTotalWorkers(siteDTO.getTotalWorkers());
                    site.setSupervisorName(siteDTO.getSupervisorName());
                    site.setSupervisorPhone(siteDTO.getSupervisorPhone());
                    site.setDescription(siteDTO.getDescription());
                    if (siteDTO.getStatus() != null) {
                        site.setStatus(Site.SiteStatus.valueOf(siteDTO.getStatus()));
                    }
                    Site updatedSite = siteRepository.save(site);
                    return ResponseEntity.ok(new ApiResponse(true, "Site updated successfully", convertToDTO(updatedSite)));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Site not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSite(@PathVariable Long id) {
        return siteRepository.findById(id)
                .map(site -> {
                    siteRepository.deleteById(id);
                    return ResponseEntity.ok(new ApiResponse(true, "Site deleted successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Site not found")));
    }

    private SiteDTO convertToDTO(Site site) {
        SiteDTO dto = new SiteDTO();
        dto.setId(site.getId());
        dto.setProjectName(site.getProjectName());
        dto.setLocation(site.getLocation());
        dto.setStartDate(site.getStartDate());
        dto.setEndDate(site.getEndDate());
        dto.setClientName(site.getClientName());
        dto.setBudget(site.getBudget());
        dto.setTotalWorkers(site.getTotalWorkers());
        dto.setSupervisorName(site.getSupervisorName());
        dto.setSupervisorPhone(site.getSupervisorPhone());
        dto.setStatus(site.getStatus().toString());
        dto.setDescription(site.getDescription());
        return dto;
    }

    private Site convertToEntity(SiteDTO dto) {
        Site site = new Site();
        site.setProjectName(dto.getProjectName());
        site.setLocation(dto.getLocation());
        site.setStartDate(dto.getStartDate());
        site.setEndDate(dto.getEndDate());
        site.setClientName(dto.getClientName());
        site.setBudget(dto.getBudget());
        site.setTotalWorkers(dto.getTotalWorkers());
        site.setSupervisorName(dto.getSupervisorName());
        site.setSupervisorPhone(dto.getSupervisorPhone());
        site.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            site.setStatus(Site.SiteStatus.valueOf(dto.getStatus()));
        }
        return site;
    }
}
