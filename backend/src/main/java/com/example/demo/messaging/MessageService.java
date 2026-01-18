package com.example.demo.messaging;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;
    private final UserRepository userRepo;
    private final com.example.demo.repository.MatchRepository matchRepo;

    public MessageService(ConversationRepository conversationRepo,
                          MessageRepository messageRepo,
                          UserRepository userRepo,
                          com.example.demo.repository.MatchRepository matchRepo) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.matchRepo = matchRepo;
    }

    // ─────────────────────────────────────────────
    // GET ALL CONVERSATIONS FOR A USER
    // ─────────────────────────────────────────────
    public List<ConversationDTO> getConversations(Long userId) {
        List<Conversation> conversations = conversationRepo.findAllByUserId(userId);
        List<ConversationDTO> dtos = new ArrayList<>();

        for (Conversation conv : conversations) {
            Long otherUserId = conv.getUser1Id().equals(userId) ? conv.getUser2Id() : conv.getUser1Id();

            // Get other user's info
            String otherUserName = "Unknown";
            String otherUserProfilePictureUrl = null;
            User otherUser = userRepo.findById(otherUserId).orElse(null);
            if (otherUser != null) {
                otherUserName = otherUser.getName() != null ? otherUser.getName() : otherUser.getUsername();
                otherUserProfilePictureUrl = otherUser.getProfilePictureUrl();
            }

            long unreadCount = messageRepo.countUnread(conv.getId(), userId);
            boolean matched = false;
            
            ConversationDTO convDto = new ConversationDTO(
                conv.getId(),
                otherUserId,
                otherUserName,
                otherUserProfilePictureUrl,
                conv.getLastMessageText(),
                conv.getLastMessageAt(),
                unreadCount,
                matched,
                conv.getSessionId()
            );

            com.example.demo.model.Match matchRecord = matchRepo.findByUsers(userId, otherUserId).orElse(null);
            if (matchRecord != null) {
                convDto.setMatched(true);
                if (userId.equals(matchRecord.getUser1Id())) {
                    convDto.setMyTeachingGoal(matchRecord.getUser1TeachingGoal());
                    convDto.setMyTeachingCompleted(matchRecord.getUser1TeachingCompleted());
                    convDto.setMyTeachingSubject(matchRecord.getUser1TeachingSubject());
                    
                    convDto.setMyLearningGoal(matchRecord.getUser2TeachingGoal());
                    convDto.setMyLearningCompleted(matchRecord.getUser2TeachingCompleted());
                    convDto.setMyLearningSubject(matchRecord.getUser2TeachingSubject());
                } else {
                    convDto.setMyTeachingGoal(matchRecord.getUser2TeachingGoal());
                    convDto.setMyTeachingCompleted(matchRecord.getUser2TeachingCompleted());
                    convDto.setMyTeachingSubject(matchRecord.getUser2TeachingSubject());

                    convDto.setMyLearningGoal(matchRecord.getUser1TeachingGoal());
                    convDto.setMyLearningCompleted(matchRecord.getUser1TeachingCompleted());
                    convDto.setMyLearningSubject(matchRecord.getUser1TeachingSubject());
                }
            }

            dtos.add(convDto);
        }

        return dtos;
    }

    // ─────────────────────────────────────────────
    // GET MESSAGES IN A CONVERSATION
    // ─────────────────────────────────────────────
    @Transactional
    public List<Message> getMessages(Long conversationId, Long userId) {
        // Mark messages as read
        messageRepo.markAllAsRead(conversationId, userId);

        return messageRepo.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    // ─────────────────────────────────────────────
    // SEND A MESSAGE
    // ─────────────────────────────────────────────
    @Transactional
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        return sendMessage(senderId, receiverId, content, false);
    }

    @Transactional
    public Message sendMessage(Long senderId, Long receiverId, String content, boolean isSystem) {
        return sendMessage(senderId, receiverId, content, isSystem, "text", null);
    }

    @Transactional
    public Message sendMessage(Long senderId, Long receiverId, String content, boolean isSystem, String messageType, String fileUrl) {
        if ((content == null || content.trim().isEmpty()) && fileUrl == null) {
            throw new IllegalArgumentException("Message content or file must be provided");
        }
        if (senderId.equals(receiverId) && !isSystem) {
            throw new IllegalArgumentException("Cannot send a message to yourself");
        }

        // Find or create conversation (always store smaller ID as user1)
        Long user1 = Math.min(senderId, receiverId);
        Long user2 = Math.max(senderId, receiverId);

        Conversation conversation = conversationRepo.findByUserPair(senderId, receiverId)
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setUser1Id(user1);
                    newConv.setUser2Id(user2);
                    return conversationRepo.save(newConv);
                });

        // Create message
        Message message = new Message();
        message.setConversationId(conversation.getId());
        message.setSenderId(senderId);
        message.setContent(content != null ? content.trim() : "");
        message.setSystem(isSystem);
        message.setMessageType(messageType != null ? messageType : "text");
        message.setFileUrl(fileUrl);
        Message saved = messageRepo.save(message);

        // Update conversation preview
        String preview = (messageType != null && messageType.equals("file")) ? "Shared a file" : content;
        if (preview != null && preview.length() > 100) {
            preview = preview.substring(0, 100) + "...";
        }
        conversation.setLastMessageText(preview);
        conversation.setLastMessageAt(saved.getCreatedAt());
        conversationRepo.save(conversation);

        return saved;
    }

    // ─────────────────────────────────────────────
    // MARK CONVERSATION AS READ
    // ─────────────────────────────────────────────
    @Transactional
    public void markAsRead(Long conversationId, Long userId) {
        messageRepo.markAllAsRead(conversationId, userId);
    }

    public long getTotalUnreadCount(Long userId) {
        return messageRepo.countTotalUnread(userId);
    }
}
