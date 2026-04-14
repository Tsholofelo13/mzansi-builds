package com.mzansi.builds.controller;

import com.mzansi.builds.entity.Project;
import com.mzansi.builds.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class ProjectControllerTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    public void testFindAllProjects() {
        List<Project> projects = projectRepository.findAll();
        assertThat(projects).isNotNull();
    }

    @Test
    public void testFindCompletedProjects() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            if (project.getStage().toString().equals("COMPLETED")) {
                assertThat(project.isCompleted()).isTrue();
            }
        }
    }

    @Test
    public void testProjectsHaveTitles() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            assertThat(project.getTitle()).isNotEmpty();
        }
    }
}
