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

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")

public class ProjectController

{

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
                project.setStage(ProjectStage.valueOf(request.getStage()));
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

    @GetMapping("/my-projects")
    public List<Project> getMyProjects(@RequestHeader("email") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) return List.of();
        return projectRepository.findByOwner(user);
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
            project.setStage(ProjectStage.valueOf(stage));

            if (stage.equals("COMPLETED") && !project.isCompleted()) {
                project.setCompleted(true);
                project.setCompletedAt(LocalDateTime.now());
            }

            projectRepository.save(project);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid stage");
            return ResponseEntity.badRequest().body(error);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Project updated successfully!");
        response.put("stage", stage);
        return ResponseEntity.ok(response);
    }
}
