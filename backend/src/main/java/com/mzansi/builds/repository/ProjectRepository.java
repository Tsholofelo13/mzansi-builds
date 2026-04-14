package com.mzansi.builds.repository;

import com.mzansi.builds.entity.Project;
import com.mzansi.builds.entity.ProjectStage;
import com.mzansi.builds.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);
    List<Project> findAllByOrderByCreatedAtDesc();
    List<Project> findByStage(ProjectStage stage);
}
