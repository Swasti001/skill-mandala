/*
 * Decompiled with CFR 0.152.
 */
package com.example.demo.dto;

public class MatchResponseDTO {
    private boolean matched;
    private Long otherUserId;
    private String otherUserName;
    private CommonSkillsDTO commonSkills;

    public MatchResponseDTO(boolean matched, Long otherUserId, String otherUserName) {
        this.matched = matched;
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
    }

    public MatchResponseDTO(boolean matched, Long otherUserId, String otherUserName, CommonSkillsDTO commonSkills) {
        this.matched = matched;
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.commonSkills = commonSkills;
    }

    public static class CommonSkillsDTO {
        public java.util.List<String> teaching;
        public java.util.List<String> learning;

        public CommonSkillsDTO(java.util.List<String> teaching, java.util.List<String> learning) {
            this.teaching = teaching;
            this.learning = learning;
        }
    }

    public boolean isMatched() {
        return this.matched;
    }

    public void setMatched(boolean matched) {
        this.matched = matched;
    }

    public Long getOtherUserId() {
        return this.otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return this.otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public CommonSkillsDTO getCommonSkills() {
        return commonSkills;
    }

    public void setCommonSkills(CommonSkillsDTO commonSkills) {
        this.commonSkills = commonSkills;
    }
}

