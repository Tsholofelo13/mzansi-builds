package com.mzansi.builds.dto;

public class ProjectRequest {
    private String title;
    private String description;
    private String stage;
    private String supportNeeded;
    private String githubRepoUrl;

    // Getters
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStage() {
        return stage;
    }

    public String getSupportNeeded() {
        return supportNeeded;
    }

    public String getGithubRepoUrl() {
        return githubRepoUrl;
    }

    // Setters
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public void setSupportNeeded(String supportNeeded) {
        this.supportNeeded = supportNeeded;
    }

    public void setGithubRepoUrl(String githubRepoUrl) {
        this.githubRepoUrl = githubRepoUrl;
    }
}