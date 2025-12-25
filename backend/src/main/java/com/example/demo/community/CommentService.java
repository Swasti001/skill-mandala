package com.example.demo.community;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final com.example.demo.security.JwtUtils jwtUtils;

    public CommentService(CommentRepository commentRepository, 
                           PostRepository postRepository, 
                           UserRepository userRepository,
                           com.example.demo.security.JwtUtils jwtUtils) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    public List<CommentResponseDTO> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDTO createComment(Long postId, Long userId, String content) {
        if (userId == null) {
            throw new IllegalArgumentException("User identity not found in token. Please log out and back in.");
        }
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);

        Comment savedComment = commentRepository.save(comment);
        return mapToResponseDTO(savedComment);
    }

    @Transactional
    public CommentResponseDTO createCommentWithFallback(Long postId, Long userId, String token, String content) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        
        if (user == null) {
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

        return createComment(postId, user.getId(), content);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Only the owner can delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponseDTO mapToResponseDTO(Comment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPost().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setAuthorName(comment.getUser().getName() != null ? comment.getUser().getName() : comment.getUser().getUsername());
        dto.setAuthorProfilePictureUrl(comment.getUser().getProfilePictureUrl());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
