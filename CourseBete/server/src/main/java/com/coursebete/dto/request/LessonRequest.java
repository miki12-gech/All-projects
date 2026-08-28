package com.coursebete.dto.request;

import java.util.List;

public class LessonRequest {
    private String title;
    private String videoUrl;
    private String contentText;
    private Integer order;
    private List<QuestionRequest> questions;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }

    public List<QuestionRequest> getQuestions() { return questions; }
    public void setQuestions(List<QuestionRequest> questions) { this.questions = questions; }
}
