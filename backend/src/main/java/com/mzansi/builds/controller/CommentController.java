package com.mzansi.builds.controller;

import com.mzansi.builds.entity.Comment;
import com.mzansi.builds.entity.Project;
import com.mzansi.builds.entity.User;
import com.mzansi.builds.repository.CommentRepository;
import com.mzansi.builds.repository.ProjectRepository;
import com.mzansi.builds.repository.UserRepository;
import com.mzansi.builds.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {
    private final CommentRepository commentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public CommentController(CommentRepository commentRepository, ProjectRepository projectRepository, 
                             UserRepository userRepository, NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    
    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> addComment(@PathVariable Long projectId, 
                                        @RequestBody Map<String, String> request,
                                        @RequestHeader("email") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        Project project = projectRepository.findById(projectId).orElse(null);
        
        if (user == null || project == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user or project"));
        }
        
        Comment comment = new Comment();
        comment.setContent(request.get("content"));
        comment.setCollaborationRequest(Boolean.parseBoolean(request.get("isCollaborationRequest")));
        comment.setAuthor(user);
        comment.setProject(project);
        
        commentRepository.save(comment);
        
        if (!project.getOwner().getEmail().equals(userEmail)) {
            notificationService.createNotification(project.getOwner(), 
                user.getFullName() + " commented on your project: " + project.getTitle(),
                "COMMENT", project.getId());
        }
        
        return ResponseEntity.ok(Map.of("message", "Comment added successfully"));
    }
    
    @GetMapping("/project/{projectId}")
    public List<Comment> getComments(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return List.of();
        return commentRepository.findByProjectOrderByCreatedAtDesc(project);
    }
}
