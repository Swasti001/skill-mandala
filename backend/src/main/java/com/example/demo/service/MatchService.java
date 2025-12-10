package com.example.demo.service;

import com.example.demo.dto.MatchCardDTO;
import com.example.demo.dto.MatchResultDTO;
import com.example.demo.messaging.Conversation;
import com.example.demo.messaging.ConversationRepository;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final UserRepository userRepository;
    private final UserOnboardingRepository onboardingRepository;
    private final MatchRepository matchRepository;
    private final MatchActionRepository actionRepository;
    private final SessionRepository sessionRepository;
    private final ConversationRepository conversationRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MatchService(UserRepository userRepository, 
                        UserOnboardingRepository onboardingRepository,
                        MatchRepository matchRepository,
                        MatchActionRepository actionRepository,
                        SessionRepository sessionRepository,
                        ConversationRepository conversationRepository,
                        NotificationService notificationService) {
        this.userRepository = userRepository;
        this.onboardingRepository = onboardingRepository;
        this.matchRepository = matchRepository;
        this.actionRepository = actionRepository;
        this.sessionRepository = sessionRepository;
        this.conversationRepository = conversationRepository;
        this.notificationService = notificationService;
    }

    public List<MatchCardDTO> findMatches(Long userId) {
        try {
            User userA = userRepository.findById(userId).orElse(null);
            if (userA == null) {
                System.err.println("[MatchService] User not found: " + userId);
                return new ArrayList<>();
            }

            UserOnboarding onboardingA = onboardingRepository.findByUser(userA).orElse(null);
            if (onboardingA == null) {
                System.err.println("[MatchService] Onboarding not found for user: " + userId);
                return new ArrayList<>();
            }

            // Parse A
            List<String> aTeach = normalizeList(parseList(onboardingA.getTeachSkills()));
            List<String> aLearn = normalizeList(parseList(onboardingA.getLearnSkills()));

            // A's availability for matching should be their LEARN availability
            Map<String, String> aAvail = normalizeAvailability(parseMap(onboardingA.getLearnAvailability()));

            String aMode = safe(onboardingA.getMode()).toLowerCase();
            String aLocation = safe(onboardingA.getLocation());

            // Load existing actions to exclude
            List<MatchAction> myActions = actionRepository.findByFromUserId(userId);
            Set<Long> excludedUserIds = myActions.stream()
                    .map(MatchAction::getToUserId)
                    .collect(Collectors.toSet());
            excludedUserIds.add(userId); // exclude self

            // Load all candidates
            List<UserOnboarding> all = onboardingRepository.findAll();
            List<MatchCardDTO> results = new ArrayList<>();

            for (UserOnboarding onboardingB : all) {
                try {
                    if (onboardingB == null || onboardingB.getUser() == null) continue;
                    Long bId = onboardingB.getUser().getId();
                    if (bId == null || excludedUserIds.contains(bId)) continue;

                    // Parse B
                    List<String> bTeach = normalizeList(parseList(onboardingB.getTeachSkills()));
                    List<String> bLearn = normalizeList(parseList(onboardingB.getLearnSkills()));

                    // B's availability for matching should be their TEACH availability
                    Map<String, String> bAvail = normalizeAvailability(parseMap(onboardingB.getTeachAvailability()));

                    String bMode = safe(onboardingB.getMode()).toLowerCase();
                    String bLocation = safe(onboardingB.getLocation());

                    // --- RULE 1: mutual exchange required
                    List<String> theyTeachYou = intersection(aLearn, bTeach);
                    if (theyTeachYou.isEmpty()) continue;

                    List<String> theyLearnFromYou = intersection(bLearn, aTeach);
                    if (theyLearnFromYou.isEmpty()) continue;

                    // --- RULE 2: availability overlap (optional if either side has no data)
                    List<String> overlap = availabilityOverlap(aAvail, bAvail);
                    boolean availabilityRequired = !aAvail.isEmpty() && !bAvail.isEmpty();
                    if (availabilityRequired && overlap.isEmpty()) continue;

                    // --- RULE 3: mode + location required
                    if (!modeAndLocationCompatible(aMode, aLocation, bMode, bLocation)) continue;

                    // score (ranking)
                    int score = 0;
                    score += theyTeachYou.size() * 10;
                    score += theyLearnFromYou.size() * 10;
                    score += overlap.size() * 5;

                    // boost if same location (useful for in_person)
                    if (!aLocation.isBlank() && !bLocation.isBlank() && aLocation.equalsIgnoreCase(bLocation)) {
                        score += 3;
                    }

                    MatchCardDTO dto = new MatchCardDTO();
                    dto.setUserId(bId);
                    dto.setName(onboardingB.getUser().getName() != null ? onboardingB.getUser().getName() : "Mandala User");
                    dto.setProfilePictureUrl(onboardingB.getUser().getProfilePictureUrl());
                    dto.setLocation(bLocation);
                    dto.setMode(bMode);
                    dto.setTheyTeachYou(theyTeachYou);
                    dto.setTheyLearnFromYou(theyLearnFromYou);
                    dto.setOverlapSlots(overlap.isEmpty() ? List.of("Flexible") : overlap);
                    dto.setScore(score);

                    // Add reputation scores for discovery
                    dto.setTeachingReputation(onboardingB.getUser().getTeachingReputation());
                    dto.setLearningReputation(onboardingB.getUser().getLearningReputation());
                    dto.setTotalSessions(onboardingB.getUser().getTotalTeachingSessions() + 
                                       onboardingB.getUser().getTotalLearningSessions());

                    results.add(dto);
                } catch (Exception candidateEx) {
                    System.err.println("[MatchService] Skipping candidate due to error: " + candidateEx.getMessage());
                }
            }

            results.sort((x, y) -> Integer.compare(y.getScore(), x.getScore()));
            return results.stream().limit(20).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("[MatchService] findMatches failed for userId=" + userId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // ─────────────────────────────────────────────
    // HANDLE MATCH ACTIONS (CONNECT, REJECT, STAR)
    // ─────────────────────────────────────────────
    @Transactional
    public MatchResultDTO handleMatchAction(String actionTypeStr, Long fromUserId, Long toUserId) {
        MatchAction.ActionType actionType;
        try {
            actionType = MatchAction.ActionType.valueOf(actionTypeStr.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid action type: " + actionTypeStr);
        }

        // 1. Record the action
        MatchAction action = actionRepository.findByFromUserIdAndToUserId(fromUserId, toUserId)
                .orElse(new MatchAction());
        action.setFromUserId(fromUserId);
        action.setToUserId(toUserId);
        action.setActionType(actionType);
        actionRepository.save(action);


        if (actionType == MatchAction.ActionType.CONNECT) {
            Optional<MatchAction> reverseAction = actionRepository.findByFromUserIdAndToUserId(toUserId, fromUserId);
            
            if (reverseAction.isPresent() && reverseAction.get().getActionType() == MatchAction.ActionType.CONNECT) {
                // IT'S A MATCH!
                return triggerMutualMatch(fromUserId, toUserId);
            } else {
                // One-way connect: Create a pending session and notify
                createPendingSession(fromUserId, toUserId);
            }
        }

        return new MatchResultDTO(false);
    }

    private void createPendingSession(Long fromUserId, Long toUserId) {
        // Check if session already exists
        boolean exists = sessionRepository.existsByUsers(fromUserId, toUserId);
        if (exists) return;

        User fromUser = userRepository.findById(fromUserId).orElse(null);
        User toUser = userRepository.findById(toUserId).orElse(null);
        if (fromUser == null || toUser == null) return;

        UserOnboarding o1 = onboardingRepository.findByUser(fromUser).orElse(null);
        UserOnboarding o2 = onboardingRepository.findByUser(toUser).orElse(null);

        Session session = new Session();
        session.setUserA(fromUserId);
        session.setUserB(toUserId);
        session.setStatus(Session.SessionStatus.PENDING);
        session.setMode("Online");

        if (o1 != null && o2 != null) {
            List<String> toLearn = intersection(parseList(o1.getLearnSkills()), parseList(o2.getTeachSkills()));
            List<String> toTeach = intersection(parseList(o1.getTeachSkills()), parseList(o2.getLearnSkills()));
            try {
                session.setSkillsToLearn(objectMapper.writeValueAsString(toLearn));
                session.setSkillsToTeach(objectMapper.writeValueAsString(toTeach));
            } catch (Exception e) {
                // Ignore parsing errors for now
            }
        }

        sessionRepository.save(session);

        // Notify the receiver
        String msg = String.format("%s sent you a connection request! Weaver Mandala is expanding.", 
                        fromUser.getName() != null ? fromUser.getName() : "A fellow Weaver");
        notificationService.createNotification(msg, "SESSION", fromUserId, toUserId);
    }

    private MatchResultDTO triggerMutualMatch(Long u1, Long u2) {
        // Create Match record if doesn't exist
        if (!matchRepository.existsByUsers(u1, u2)) {
            Match match = new Match();
            match.setUser1Id(u1);
            match.setUser2Id(u2);
            matchRepository.save(match);
        }

        // Create an Accepted Session (Automatic Connect)
        Session session = new Session();
        session.setUserA(u1);
        session.setUserB(u2);
        session.setStatus(Session.SessionStatus.ACCEPTED);
        session.setMode("Online");
        session = sessionRepository.save(session);

        // Create/Find Conversation
        Conversation conv = conversationRepository.findByUserPair(u1, u2)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setUser1Id(Math.min(u1, u2));
                    c.setUser2Id(Math.max(u1, u2));
                    return conversationRepository.save(c);
                });
        
        // Update conversation with sessionId if missing
        if (conv.getSessionId() == null) {
            conv.setSessionId(session.getId());
            conversationRepository.save(conv);
        }

        // Build Response
        MatchResultDTO result = new MatchResultDTO(true);
        result.setSessionId(session.getId());
        result.setChatId(conv.getId());

        User fromUser = userRepository.findById(u1).orElse(null);
        User matchedUser = userRepository.findById(u2).orElse(null);
        if (matchedUser != null) {
            result.setMatchedUser(new MatchResultDTO.MatchedUserDTO(
                matchedUser.getId(),
                matchedUser.getName() != null ? matchedUser.getName() : "Mandala User",
                matchedUser.getProfilePictureUrl()
            ));
        }

        // Add common skills for the overlay
        if (fromUser != null && matchedUser != null) {
            UserOnboarding o1 = onboardingRepository.findByUser(fromUser).orElse(null);
            UserOnboarding o2 = onboardingRepository.findByUser(matchedUser).orElse(null);
            if (o1 != null && o2 != null) {
                List<String> teach = intersection(parseList(o1.getTeachSkills()), parseList(o2.getLearnSkills()));
                List<String> learn = intersection(parseList(o1.getLearnSkills()), parseList(o2.getTeachSkills()));
                result.setCommonSkills(new MatchResultDTO.CommonSkillsDTO(teach, learn));
            }
        }

        // Notifications
        try {
            notificationService.createNotification("Mandala Synchronized! It's a match.", "MATCH", u2, u1);
            notificationService.createNotification("Mandala Synchronized! It's a match.", "MATCH", u1, u2);
        } catch (Exception e) {
            // Log and continue, don't fail the match action if notifications fail
            System.err.println("Notification failed during match: " + e.getMessage());
        }

        return result;
    }

    public List<MatchCardDTO> getMutualMatches(Long userId) {
        List<Match> matches = matchRepository.findAllByUserId(userId);
        List<MatchCardDTO> result = new ArrayList<>();
        User u1 = userRepository.findById(userId).orElse(null);
        if (u1 == null) return result;
        UserOnboarding o1 = onboardingRepository.findByUser(u1).orElse(null);
        if (o1 == null) return result;

        List<String> aTeach = normalizeList(parseList(o1.getTeachSkills()));
        List<String> aLearn = normalizeList(parseList(o1.getLearnSkills()));

        for (Match m : matches) {
            Long otherId = m.getUser1Id().equals(userId) ? m.getUser2Id() : m.getUser1Id();
            User other = userRepository.findById(otherId).orElse(null);
            if (other == null) continue;
            UserOnboarding o2 = onboardingRepository.findByUser(other).orElse(null);
            if (o2 == null) continue;

            List<String> bTeach = normalizeList(parseList(o2.getTeachSkills()));
            List<String> bLearn = normalizeList(parseList(o2.getLearnSkills()));

            MatchCardDTO dto = new MatchCardDTO();
            dto.setUserId(otherId);
            dto.setName(other.getName());
            dto.setProfilePictureUrl(other.getProfilePictureUrl());
            dto.setMode(safe(o2.getMode()));
            dto.setLocation(safe(o2.getLocation()));
            dto.setTheyTeachYou(intersection(aLearn, bTeach));
            dto.setTheyLearnFromYou(intersection(bLearn, aTeach));
            
            // Add reputation scores for mutual matches
            dto.setTeachingReputation(other.getTeachingReputation());
            dto.setLearningReputation(other.getLearningReputation());
            dto.setTotalSessions(other.getTotalTeachingSessions() + other.getTotalLearningSessions());
            
            result.add(dto);
        }
        return result;
    }

    // ---------------- Helpers ----------------

    private String safe(String s) {
        return s == null ? "" : s.trim();
    }

    private List<String> parseList(String json) {
        if (json == null || json.trim().isEmpty()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private Map<String, String> parseMap(String json) {
        if (json == null || json.trim().isEmpty()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    private List<String> normalizeList(List<String> skills) {
        return skills.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .distinct()
                .collect(Collectors.toList());
    }

    private Map<String, String> normalizeAvailability(Map<String, String> avail) {
        Map<String, String> out = new HashMap<>();
        for (Map.Entry<String, String> e : avail.entrySet()) {
            String day = e.getKey() == null ? "" : e.getKey().trim();
            String slot = e.getValue() == null ? "" : e.getValue().trim();
            if (!day.isBlank() && !slot.isBlank()) {
                out.put(day, slot.toLowerCase());
            }
        }
        return out;
    }

    private List<String> intersection(List<String> a, List<String> b) {
        Set<String> setB = new HashSet<>(b);
        return a.stream()
                .filter(setB::contains)
                .distinct()
                .collect(Collectors.toList());
    }

    private List<String> availabilityOverlap(Map<String, String> a, Map<String, String> b) {
        List<String> overlap = new ArrayList<>();
        for (String day : a.keySet()) {
            String aSlot = a.get(day);
            String bSlot = b.get(day);
            if (aSlot != null && bSlot != null && aSlot.equalsIgnoreCase(bSlot)) {
                overlap.add(day + " " + capitalize(aSlot));
            }
        }
        return overlap;
    }

    private String capitalize(String s) {
        if (s == null || s.isBlank()) return "";
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    private boolean modeAndLocationCompatible(String aMode, String aLoc, String bMode, String bLoc) {
        boolean aOnline = aMode.equals("online") || aMode.equals("both");
        boolean bOnline = bMode.equals("online") || bMode.equals("both");

        boolean aInPerson = aMode.equals("in_person") || aMode.equals("both");
        boolean bInPerson = bMode.equals("in_person") || bMode.equals("both");

        // If both can do online => OK
        if (aOnline && bOnline) return true;

        // Otherwise require in_person AND same location
        if (aInPerson && bInPerson) {
            if (aLoc.isBlank() || bLoc.isBlank()) return false;
            return aLoc.equalsIgnoreCase(bLoc);
        }

        return false;
    }

    @Transactional
    public void updateMatchAgreement(Long teacherId, Long learnerId, Integer totalSessions, String subject) {
        Match match = matchRepository.findByUsers(teacherId, learnerId).orElse(null);
        if (match != null) {
            if (teacherId.equals(match.getUser1Id())) {
                match.setUser1TeachingGoal(totalSessions);
                if (subject != null && !subject.trim().isEmpty()) {
                    match.setUser1TeachingSubject(subject);
                }
                if (match.getUser1TeachingCompleted() == null) {
                    match.setUser1TeachingCompleted(0);
                }
            } else if (teacherId.equals(match.getUser2Id())) {
                match.setUser2TeachingGoal(totalSessions);
                if (subject != null && !subject.trim().isEmpty()) {
                    match.setUser2TeachingSubject(subject);
                }
                if (match.getUser2TeachingCompleted() == null) {
                    match.setUser2TeachingCompleted(0);
                }
            }
            matchRepository.save(match);
        }
    }
}