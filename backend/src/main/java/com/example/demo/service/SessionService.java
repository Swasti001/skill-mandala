package com.example.demo.service;

import com.example.demo.dto.BookSessionDTO;
import com.example.demo.dto.BookSessionResponseDTO;
import com.example.demo.dto.MatchResponseDTO;
import com.example.demo.dto.SessionCardDTO;
import com.example.demo.model.Match;
import com.example.demo.model.Session;
import com.example.demo.model.User;
import com.example.demo.model.ZoomMeeting;
import com.example.demo.repository.MatchRepository;
import com.example.demo.repository.SessionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ZoomMeetingRepository;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.WalletTransactionRepository;
import com.example.demo.model.WalletTransaction;
import com.example.demo.messaging.Conversation;
import com.example.demo.messaging.ConversationRepository;
import com.example.demo.messaging.MessageService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SessionService {
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final ZoomMeetingRepository zoomRepo;
    private final NotificationService notificationService;
    private final ConversationRepository conversationRepository;
    private final ZoomService zoomService;
    private final MessageService messageService;
    private final FeedbackRepository feedbackRepository;
    private final WalletTransactionRepository transactionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy \u2022 hh:mm a");

    public SessionService(SessionRepository sessionRepository, UserRepository userRepository, MatchRepository matchRepository, 
                         ZoomMeetingRepository zoomRepo, NotificationService notificationService, 
                         ConversationRepository conversationRepository, ZoomService zoomService,
                         MessageService messageService, FeedbackRepository feedbackRepository,
                         WalletTransactionRepository transactionRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.zoomRepo = zoomRepo;
        this.notificationService = notificationService;
        this.conversationRepository = conversationRepository;
        this.zoomService = zoomService;
        this.messageService = messageService;
        this.feedbackRepository = feedbackRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<SessionCardDTO> getUserSessions(Long userId) {
        List<Session> raw = this.sessionRepository.findByUserId(userId);
        Map<Long, SessionCardDTO> mappedSessions = new LinkedHashMap<>();
        
        for (Session s : raw) {
            SessionCardDTO dto = new SessionCardDTO();
            dto.setSessionId(s.getId());
            Long otherId = s.getUserA().equals(userId) ? s.getUserB() : s.getUserA();
            dto.setOtherUserId(otherId);
            User other = this.userRepository.findById(otherId).orElse(null);
            dto.setOtherUserName(other != null ? other.getName() : "Expert Weaver");
            dto.setOtherUserProfilePictureUrl(other != null ? other.getProfilePictureUrl() : null);
            if (s.getUserA().equals(userId)) {
                dto.setYouLearn(this.parseList(s.getSkillsToLearn()));
                dto.setYouTeach(this.parseList(s.getSkillsToTeach()));
            } else {
                dto.setYouLearn(this.parseList(s.getSkillsToTeach()));
                dto.setYouTeach(this.parseList(s.getSkillsToLearn()));
            }
            dto.setDateTime(s.getSessionDate() != null ? s.getSessionDate().format(this.formatter) : "TBD");
            dto.setMode(s.getMode() != null ? s.getMode() : "Online");
            dto.setStatus(s.getStatus().name());
            dto.setIncoming(s.getUserB().equals(userId));
            dto.setTopic(s.getTopic());
            dto.setDuration(s.getDuration());
            
            this.zoomRepo.findBySessionIdAndStatus(s.getId(), ZoomMeeting.ZoomStatus.ACTIVE).ifPresent(zm -> {
                dto.setHasZoomMeeting(true);
                dto.setZoomMeetingId(zm.getMeetingId());
                dto.setHost(zm.getCreatedBy().equals(userId));
            });

            // Set feedback status
            dto.setFeedbackSubmitted(feedbackRepository.existsBySessionIdAndFromUserId(s.getId(), userId));
            
            if (!mappedSessions.containsKey(otherId)) {
                mappedSessions.put(otherId, dto);
            } else {
                String existingStatus = mappedSessions.get(otherId).getStatus();
                String newStatus = dto.getStatus();
                if (newStatus.equals("ACTIVE") || 
                   (newStatus.equals("BOOKED") && !existingStatus.equals("ACTIVE")) ||
                   (newStatus.equals("ACCEPTED") && !existingStatus.equals("ACTIVE") && !existingStatus.equals("BOOKED")) ||
                   (newStatus.equals("MATCHED") && !existingStatus.equals("ACTIVE") && !existingStatus.equals("ACCEPTED") && !existingStatus.equals("BOOKED"))) {
                    mappedSessions.put(otherId, dto);
                }
            }
        }
        return new ArrayList<>(mappedSessions.values());
    }

    public MatchResponseDTO acceptSession(Long sessionId) {
        Session s = this.sessionRepository.findById(sessionId).orElse(null);
        if (s == null || s.getStatus() == Session.SessionStatus.ACCEPTED || s.getStatus() == Session.SessionStatus.MATCHED) {
            return new MatchResponseDTO(false, null, null);
        }
        s.setStatus(Session.SessionStatus.ACCEPTED);
        this.sessionRepository.save(s);
        
        Long userAId = s.getUserA();
        Long userBId = s.getUserB();
        
        if (userAId == null || userBId == null) {
            return new MatchResponseDTO(false, null, "Incomplete Session Hub Data");
        }

        User userA = this.userRepository.findById(userAId).orElse(null);
        User userB = this.userRepository.findById(userBId).orElse(null);
        
        String otherUserName = userA != null ? userA.getName() : "Expert Weaver";
        Long otherUserId = userAId;
        
        boolean matchExists = this.matchRepository.existsByUsers(userAId, userBId);
        if (!matchExists) {
            Match match = new Match();
            match.setUser1Id(userAId);
            match.setUser2Id(userBId);
            this.matchRepository.save(match);
        }

        Conversation conv = conversationRepository.findByUserPair(userAId, userBId)
            .orElseGet(() -> {
                Conversation c = new Conversation();
                c.setUser1Id(Math.min(userAId, userBId));
                c.setUser2Id(Math.max(userAId, userBId));
                return conversationRepository.save(c);
            });
        
        if (conv.getSessionId() == null) {
            conv.setSessionId(s.getId());
            conversationRepository.save(conv);
        }

        List<String> get = parseList(s.getSkillsToLearn());
        List<String> give = parseList(s.getSkillsToTeach());
        MatchResponseDTO.CommonSkillsDTO skills = new MatchResponseDTO.CommonSkillsDTO(get, give);

        String bName = userB != null ? userB.getName() : "A Fellow Weaver";
        this.notificationService.createNotification(userAId, "You matched with " + bName + "! Messaging is now active.", "MATCH");
        return new MatchResponseDTO(true, otherUserId, otherUserName, skills);
    }

    public void rejectSession(Long sessionId) {
        Session s = this.sessionRepository.findById(sessionId).orElse(null);
        if (s != null) {
            s.setStatus(Session.SessionStatus.DECLINED);
            this.sessionRepository.save(s);
        }
    }

    public BookSessionResponseDTO bookSession(Long learnerId, BookSessionDTO dto) {
        User teacher = this.userRepository.findById(dto.getTeacherId()).orElse(null);
        if (teacher == null) return new BookSessionResponseDTO(false, "Invalid teacher ID");

        User learner = this.userRepository.findById(learnerId).orElse(null);
        if (learner == null) return new BookSessionResponseDTO(false, "Invalid learner");

        int duration = dto.getDuration() > 0 ? dto.getDuration() : 60;
        int creditCost = (int) Math.ceil(duration / 30.0) * 10;

        if (learner.getCredits() < creditCost) {
            return new BookSessionResponseDTO(false, "Insufficient credits. You need " + creditCost + " credits but have " + learner.getCredits());
        }

        learner.setCredits(learner.getCredits() - creditCost);
        learner.setXp(learner.getXp() + 5);
        this.userRepository.save(learner);

        // Deduct from learner, credit to teacher immediately upon booking
        teacher.setCredits(teacher.getCredits() + creditCost);
        this.userRepository.save(teacher);

        // Log transactions
        String teacherName = teacher != null ? teacher.getName() : "Expert Weaver";
        this.transactionRepository.save(new WalletTransaction(learnerId, -creditCost, "SPEND", "Booked session: " + dto.getTopic(), teacherName, dto.getTeacherId()));
        this.transactionRepository.save(new WalletTransaction(dto.getTeacherId(), creditCost, "EARN", "Teaching Session: " + dto.getTopic(), learner.getName(), learnerId));

        // Inject System Message into the chat stream indicating booking/payment completion
        try {
            String topicName = dto.getTopic() != null ? dto.getTopic() : "General";
            String sysMsg = "💳 Payment of " + creditCost + " credits processed. Session booked: " + topicName + " (" + duration + " min).";
            messageService.sendMessage(learnerId, dto.getTeacherId(), sysMsg, true, "text", null);
        } catch (Exception e) {
            System.err.println("⚠️ Could not inject system chat message for session booking: " + e.getMessage());
        }

        Session session = new Session();
        session.setUserA(learnerId);
        session.setUserB(dto.getTeacherId());
        session.setTopic(dto.getTopic());
        session.setDuration(duration);
        session.setMode("Online");
        session.setStatus(Session.SessionStatus.BOOKED);

        try {
            session.setSessionDate(LocalDateTime.parse(dto.getDateTime()));
        } catch (Exception e) {
            session.setSessionDate(LocalDateTime.now().plusDays(1));
        }

        try {
            String topicJson = objectMapper.writeValueAsString(List.of(dto.getTopic() != null ? dto.getTopic() : "General"));
            session.setSkillsToLearn(topicJson);
            session.setSkillsToTeach(topicJson);
        } catch (Exception e) {
            session.setSkillsToLearn("[\"General\"]");
            session.setSkillsToTeach("[\"General\"]");
        }

        session = this.sessionRepository.save(session);
        this.zoomService.createMeeting(session.getId(), learnerId);

        String formattedDate = session.getSessionDate() != null ? session.getSessionDate().format(formatter) : "TBD";
        this.notificationService.createNotification(dto.getTeacherId(), learner.getName() + " booked a session: " + dto.getTopic() + " on " + formattedDate, "SESSION");
        
        return new BookSessionResponseDTO(true, session.getId(), "Session booked successfully!", learner.getCredits(), null);
    }

    public boolean completeSession(Long sessionId, Long userId) {
        Session session = this.sessionRepository.findById(sessionId).orElse(null);
        if (session == null) return false;
        if (!session.getUserA().equals(userId) && !session.getUserB().equals(userId)) return false;

        session.setStatus(Session.SessionStatus.COMPLETED);
        this.sessionRepository.save(session);

        // 💰 Wallet Logic: Award Teacher XP and send notification (Credits were already paid at booking time)
        try {
            User teacher = userRepository.findById(session.getUserB()).orElse(null);
            if (teacher != null) {
                int duration = session.getDuration() != null ? session.getDuration() : 60;
                int payout = (int) Math.ceil(duration / 30.0) * 10;
                
                teacher.setXp(teacher.getXp() + 50); // Knowledge Weaver bonus!
                userRepository.save(teacher);
                
                // Notify the teacher about their completion and XP reward
                notificationService.createNotification(
                    teacher.getId(), 
                    "Session marked completed! You received 50 XP. (Credits were transferred at booking time) 💰✨", 
                    "WALLET"
                );
            }
        } catch (Exception e) {
            System.err.println("⚠️ Wallet XP award failed: " + e.getMessage());
        }

        // --- UPDATE MATCH AGREEMENT ---
        try {
            Match match = matchRepository.findByUsers(session.getUserA(), session.getUserB()).orElse(null);
            if (match != null) {
                Long teacherId = session.getUserB();
                if (teacherId.equals(match.getUser1Id())) {
                    if (match.getUser1TeachingGoal() != null) {
                        int completed = match.getUser1TeachingCompleted() != null ? match.getUser1TeachingCompleted() : 0;
                        match.setUser1TeachingCompleted(completed + 1);
                    }
                } else if (teacherId.equals(match.getUser2Id())) {
                    if (match.getUser2TeachingGoal() != null) {
                        int completed = match.getUser2TeachingCompleted() != null ? match.getUser2TeachingCompleted() : 0;
                        match.setUser2TeachingCompleted(completed + 1);
                    }
                }
                matchRepository.save(match);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Failed to update match tracking: " + e.getMessage());
        }

        // Notify both participants that they can now leave feedback
        notificationService.createNotification(session.getUserA(), "Your session has ended. Click to share your feedback!", "FEEDBACK");
        notificationService.createNotification(session.getUserB(), "Your session has ended. Click to share your feedback!", "FEEDBACK");

        return true;
    }

    private List<String> parseList(String json) {
        if (json == null || json.trim().isEmpty()) return new ArrayList<>();
        try {
            return this.objectMapper.readValue(json, new TypeReference<List<String>>(){});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
