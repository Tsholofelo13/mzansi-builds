package com.mzansi.builds.controller;

import com.mzansi.builds.dto.ProjectRequest;
import com.mzansi.builds.entity.Project;
import com.mzansi.builds.entity.ProjectStage;
import com.mzansi.builds.entity.User;
import com.mzansi.builds.repository.ProjectRepository;
import com.mzansi.builds.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {
    
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    
    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectRequest request,
                                           @RequestHeader("email") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setSupportNeeded(request.getSupportNeeded());
        project.setGithubRepoUrl(request.getGithubRepoUrl());
        project.setOwner(user);
        
        if (request.getStage() != null) {
            try {
                ProjectStage stage = ProjectStage.valueOf(request.getStage());
                project.setStage(stage);
                if (stage == ProjectStage.COMPLETED) {
                    project.setCompleted(true);
                    project.setCompletedAt(LocalDateTime.now());
                }
            } catch (IllegalArgumentException e) {
                project.setStage(ProjectStage.IDEA);
            }
        }
        
        projectRepository.save(project);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Project created successfully!");
        response.put("projectId", project.getId());
        response.put("title", project.getTitle());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @GetMapping("/completed")
    public List<Project> getCompletedProjects() {
        return projectRepository.findAll().stream()
            .filter(p -> p.getStage() == ProjectStage.COMPLETED)
            .collect(Collectors.toList());
    }
    
    @GetMapping("/my-projects")
    public List<Project> getMyProjects(@RequestHeader("email") String userEmail) {
        System.out.println("Getting projects for email: " + userEmail);
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            System.out.println("User not found for email: " + userEmail);
            return List.of();
        }
        System.out.println("Found user: " + user.getEmail() + ", returning " + projectRepository.findByOwner(user).size() + " projects");
        return projectRepository.findByOwner(user);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id,
                                           @RequestHeader("email") String userEmail) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Project not found"));
        }
        
        if (!project.getOwner().getEmail().equals(userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You don't own this project"));
        }
        
        projectRepository.delete(project);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProjectStage(@PathVariable Long id,
                                                @RequestParam String stage,
                                                @RequestHeader("email") String userEmail) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Project not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        if (!project.getOwner().getEmail().equals(userEmail)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "You don't own this project");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }
        
        try {
            ProjectStage newStage = ProjectStage.valueOf(stage);
            project.setStage(newStage);
            
            if (newStage == ProjectStage.COMPLETED) {
                project.setCompleted(true);
                project.setCompletedAt(LocalDateTime.now());
            } else {
                project.setCompleted(false);
                project.setCompletedAt(null);
            }
            
            projectRepository.save(project);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid stage. Use: IDEA, IN_PROGRESS, REVIEW, COMPLETED");
            return ResponseEntity.badRequest().body(error);
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Project updated successfully!");
        response.put("stage", stage);
        return ResponseEntity.ok(response);
    }
}
