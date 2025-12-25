package com.example.demo.community;

import java.time.LocalDateTime;

public class PostResponseDTO {

    private Long id;
    private Long userId;
    private String authorName;
    private String authorProfilePictureUrl;
    private String content;
    private String imageUrl;
    private Long skillId;
    private String title;
    private LocalDateTime createdAt;
    
    private long likeCount;
    private long commentCount;
    private boolean isLikedByCurrentUser;

    // Constructors
    public PostResponseDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorProfilePictureUrl() { return authorProfilePictureUrl; }
    public void setAuthorProfilePictureUrl(String authorProfilePictureUrl) { this.authorProfilePictureUrl = authorProfilePictureUrl; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public long getLikeCount() { return likeCount; }
    public void setLikeCount(long likeCount) { this.likeCount = likeCount; }

    public long getCommentCount() { return commentCount; }
    public void setCommentCount(long commentCount) { this.commentCount = commentCount; }

    public boolean isLikedByCurrentUser() { return isLikedByCurrentUser; }
    public void setLikedByCurrentUser(boolean isLikedByCurrentUser) { this.isLikedByCurrentUser = isLikedByCurrentUser; }
}
