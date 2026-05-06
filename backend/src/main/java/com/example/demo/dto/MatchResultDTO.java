/*
 * Decompiled with CFR 0.152.
 */
package com.example.demo.dto;

import java.util.List;

public class MatchResultDTO {
    private boolean match;
    private Long sessionId;
    private Long chatId;
    private MatchedUserDTO matchedUser;
    private CommonSkillsDTO commonSkills;

    public MatchResultDTO(boolean match) {
        this.match = match;
    }

    public boolean isMatch() {
        return this.match;
    }

    public void setMatch(boolean match) {
        this.match = match;
    }

    public Long getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getChatId() {
        return this.chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public MatchedUserDTO getMatchedUser() {
        return this.matchedUser;
    }

    public void setMatchedUser(MatchedUserDTO matchedUser) {
        this.matchedUser = matchedUser;
    }

    public CommonSkillsDTO getCommonSkills() {
        return this.commonSkills;
    }

    public void setCommonSkills(CommonSkillsDTO commonSkills) {
        this.commonSkills = commonSkills;
    }

    public static class MatchedUserDTO {
        private Long id;
        private String name;
        private String profilePictureUrl;

        public MatchedUserDTO(Long id, String name, String profilePictureUrl) {
            this.id = id;
            this.name = name;
            this.profilePictureUrl = profilePictureUrl;
        }

        public Long getId() {
            return this.id;
        }

        public String getName() {
            return this.name;
        }

        public String getProfilePictureUrl() {
            return this.profilePictureUrl;
        }
    }

    public static class CommonSkillsDTO {
        private List<String> teach;
        private List<String> learn;

        public CommonSkillsDTO(List<String> teach, List<String> learn) {
            this.teach = teach;
            this.learn = learn;
        }

        public List<String> getTeach() {
            return this.teach;
        }

        public List<String> getLearn() {
            return this.learn;
        }
    }
}

