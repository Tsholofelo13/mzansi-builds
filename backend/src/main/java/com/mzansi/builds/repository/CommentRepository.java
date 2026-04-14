package com.mzansi.builds.repository;

import com.mzansi.builds.entity.Comment;
import com.mzansi.builds.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProjectOrderByCreatedAtDesc(Project project);
}
