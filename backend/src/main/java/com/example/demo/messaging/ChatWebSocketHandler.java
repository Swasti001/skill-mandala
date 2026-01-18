package com.example.demo.messaging;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final MessageService messageService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    // conversationId -> set of connected sessions
    private final ConcurrentHashMap<Long, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    
    // session -> userId
    private final ConcurrentHashMap<WebSocketSession, Long> sessionUserMap = new ConcurrentHashMap<>();

    // session -> active conversationId
    private final ConcurrentHashMap<WebSocketSession, Long> sessionRoomMap = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        java.net.URI uri = session.getUri();
        if (uri != null) {
            String query = uri.getQuery();
            if (query != null && query.contains("token=")) {
                String token = query.split("token=")[1].split("&")[0];
                User user = userService.getUserFromToken("Bearer " + token);
                if (user != null) {
                    sessionUserMap.put(session, user.getId());
                    System.out.println("✅ WebSocket connection established for user: " + user.getId());
                    return;
                } else {
                    System.out.println("❌ WebSocket connection rejected: Invalid or expired token inside query params.");
                }
            } else {
                System.out.println("❌ WebSocket connection rejected: Missing 'token' in query string.");
            }
        }
        System.out.println("WebSocket connection closed: unauthorized for session " + session.getId());
        session.close(CloseStatus.NOT_ACCEPTABLE);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if (!sessionUserMap.containsKey(session)) {
            return;
        }
        Long senderId = sessionUserMap.get(session);
        
        try {
            Map<String, Object> payload = objectMapper.readValue(message.getPayload(), new TypeReference<Map<String, Object>>() {});
            String type = (String) payload.get("type");

            if ("JOIN_ROOM".equals(type)) {
                Long oldRoom = sessionRoomMap.get(session);
                if (oldRoom != null && roomSessions.containsKey(oldRoom)) {
                    roomSessions.get(oldRoom).remove(session);
                }

                Number roomIdNum = (Number) payload.get("roomId");
                if (roomIdNum != null) {
                    Long roomId = roomIdNum.longValue();
                    roomSessions.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(session);
                    sessionRoomMap.put(session, roomId);
                    System.out.println("User " + senderId + " joined room " + roomId);
                }
            } else if ("CHAT_MESSAGE".equals(type)) {
                Number receiverIdNum = (Number) payload.get("receiverId");
                String content = (String) payload.get("content");
                Boolean isSystem = (Boolean) payload.get("isSystem");
                String messageType = (String) payload.get("messageType");
                String fileUrl = (String) payload.get("fileUrl");

                if (isSystem == null) isSystem = false;
                if (messageType == null) messageType = "text";

                if (receiverIdNum != null && (content != null || fileUrl != null)) {
                    Long receiverId = receiverIdNum.longValue();
                    
                    // messageService handles persisting to the database.
                    Message savedMessage = messageService.sendMessage(senderId, receiverId, content, isSystem, messageType, fileUrl);
                    Long conversationId = savedMessage.getConversationId();
                    
                    // Broadcast the saved payload
                    String outMessageAsString = objectMapper.writeValueAsString(savedMessage);
                    TextMessage outText = new TextMessage(outMessageAsString);

                    Set<WebSocketSession> roomClients = roomSessions.get(conversationId);
                    if (roomClients != null) {
                        for (WebSocketSession s : roomClients) {
                            if (s.isOpen()) {
                                try {
                                    s.sendMessage(outText);
                                } catch (Exception e) {
                                    System.err.println("Failed to send message to session: " + s.getId());
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing websocket message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long roomId = sessionRoomMap.remove(session);
        if (roomId != null && roomSessions.containsKey(roomId)) {
            roomSessions.get(roomId).remove(session);
            if (roomSessions.get(roomId).isEmpty()) {
                roomSessions.remove(roomId);
            }
        }
        sessionUserMap.remove(session);
        System.out.println("WebSocket connection closed for session: " + session.getId());
    }
}

