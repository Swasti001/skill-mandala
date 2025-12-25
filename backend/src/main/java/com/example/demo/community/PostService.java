package com.example.demo.community;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.MatchRepository;
import com.example.demo.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikePostRepository likePostRepository;
    private final CommentRepository commentRepository;
    private final com.example.demo.security.JwtUtils jwtUtils;
    private final MatchRepository matchRepository;
    private final NotificationService notificationService;

    public PostService(PostRepository postRepository, 
                       UserRepository userRepository,
                       LikePostRepository likePostRepository,
                       CommentRepository commentRepository,
                       com.example.demo.security.JwtUtils jwtUtils,
                       MatchRepository matchRepository,
                       NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likePostRepository = likePostRepository;
        this.commentRepository = commentRepository;
        this.jwtUtils = jwtUtils;
        this.matchRepository = matchRepository;
        this.notificationService = notificationService;
    }

    public Page<PostResponseDTO> getFeed(Long currentUserId, Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable).map(post -> mapToResponseDTO(post, currentUserId));
    }

    public Page<PostResponseDTO> getMatchedPosts(Long userId, Pageable pageable) {
        return postRepository.findMatchedPosts(userId, pageable).map(post -> mapToResponseDTO(post, userId));
    }

    public Page<PostResponseDTO> getTrendingPosts(Long currentUserId, Pageable pageable) {
        return postRepository.findTrendingPosts(pageable).map(post -> mapToResponseDTO(post, currentUserId));
    }

    @Transactional
    public PostResponseDTO createPost(Long userId, String content, String title, String imageUrl, Long skillId) {
        if (userId == null) {
            throw new IllegalArgumentException("User identity not found in token. Please log out and back in.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setTitle(title);
        post.setImageUrl(imageUrl);
        post.setSkillId(skillId);

        Post savedPost = postRepository.save(post);
        
        try {
            var matches = matchRepository.findAllByUserId(userId);
            String authorName = user.getName() != null ? user.getName() : user.getUsername();
            for (var m : matches) {
                Long otherId = m.getUser1Id().equals(userId) ? m.getUser2Id() : m.getUser1Id();
                notificationService.createNotification(authorName + " shared a new post: " + (title != null ? title : "Untitled"), "POST", userId, otherId);
            }
        } catch (Exception e) {}

        return mapToResponseDTO(savedPost, userId);
    }

    @Transactional
    public PostResponseDTO createPostWithFallback(Long userId, String token, String content, String title, String imageUrl, Long skillId) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        
        if (user == null) {
            // Fallback: search by username extracted from token
            try {
                String username = jwtUtils.getUsernameFromToken(token);
                if (username != null) {
                    user = userRepository.findFirstByUsername(username).orElse(null);
                }
            } catch (Exception e) {}
        }

        if (user == null) {
             throw new IllegalArgumentException("Session expired or user not found. Please re-login.");
        }

        return createPost(user.getId(), content, title, imageUrl, skillId);
    }

    @Transactional
    public PostResponseDTO updatePost(Long postId, Long userId, String content, String title) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Only the owner can update this post");
        }

        post.setContent(content);
        post.setTitle(title);
        
        Post updatedPost = postRepository.save(post);
        return mapToResponseDTO(updatedPost, userId);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Only the owner can delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional
    public boolean toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Optional<LikePost> existingLike = likePostRepository.findByPostIdAndUserId(postId, userId);

        if (existingLike.isPresent()) {
            likePostRepository.delete(existingLike.get());
            return false; // Unliked
        } else {
            likePostRepository.save(new LikePost(post, user));
            return true; // Liked
        }
    }

    public PostResponseDTO mapToResponseDTO(Post post, Long currentUserId) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setAuthorName(post.getUser().getName() != null ? post.getUser().getName() : post.getUser().getUsername());
        dto.setAuthorProfilePictureUrl(post.getUser().getProfilePictureUrl());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setSkillId(post.getSkillId());
        dto.setTitle(post.getTitle());
        dto.setCreatedAt(post.getCreatedAt());

        dto.setLikeCount(likePostRepository.countByPostId(post.getId()));
        dto.setCommentCount(commentRepository.countByPostId(post.getId()));
        
        if (currentUserId != null) {
            dto.setLikedByCurrentUser(likePostRepository.existsByPostIdAndUserId(post.getId(), currentUserId));
        }

        return dto;
    }
}
