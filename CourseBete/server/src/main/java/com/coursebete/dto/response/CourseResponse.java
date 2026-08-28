package com.coursebete.dto.response;

public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private int totalLessons;
    private int progress;

    public CourseResponse(Long id, String title, String description, String thumbnailUrl, int totalLessons, int progress) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.totalLessons = totalLessons;
        this.progress = progress;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public int getTotalLessons() { return totalLessons; }
    public void setTotalLessons(int totalLessons) { this.totalLessons = totalLessons; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
}
