package com.example.demo.messaging;

public class SendMessageDTO {

    private Long receiverId;
    private String content;

    public SendMessageDTO() {}

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
