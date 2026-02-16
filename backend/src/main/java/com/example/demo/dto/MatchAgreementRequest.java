package com.example.demo.dto;

public class MatchAgreementRequest {
    private Long teacherId;
    private Long learnerId;
    private Integer goal;
    private String subject;

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public Long getLearnerId() { return learnerId; }
    public void setLearnerId(Long learnerId) { this.learnerId = learnerId; }

    public Integer getGoal() { return goal; }
    public void setGoal(Integer goal) { this.goal = goal; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}
