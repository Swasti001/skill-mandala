package com.example.demo.community;

import com.example.demo.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final JwtUtils jwtUtils;

    public CommentController(CommentService commentService, JwtUtils jwtUtils) {
        this.commentService = commentService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable("postId") Long postId) {
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    @PostMapping
    public ResponseEntity<CommentResponseDTO> createComment(
            @RequestHeader("Authorization") String token,
            @RequestBody CommentCreateRequest request) {

        String rawToken = token.substring(7);
        Long userId = jwtUtils.getUserIdFromToken(rawToken);
        
        return ResponseEntity.ok(commentService.createCommentWithFallback(request.postId, userId, rawToken, request.content));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") Long id) {

        Long userId = jwtUtils.getUserIdFromToken(token.substring(7));
        commentService.deleteComment(id, userId);
        return ResponseEntity.ok().build();
    }

    public static class CommentCreateRequest {
        public Long postId;
        public String content;
    }
}
