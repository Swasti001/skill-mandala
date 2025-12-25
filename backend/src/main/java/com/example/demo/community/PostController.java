package com.example.demo.community;

import com.example.demo.security.JwtUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final JwtUtils jwtUtils;
    private final com.example.demo.repository.UserRepository userRepository;
    private final Path postImageStorageLocation;

    public PostController(PostService postService, JwtUtils jwtUtils, com.example.demo.repository.UserRepository userRepository) {
        this.postService = postService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.postImageStorageLocation = Paths.get("uploads/posts").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.postImageStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory for post images.", ex);
        }
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<PostResponseDTO>> getGlobalFeed(
            @RequestHeader("Authorization") String token,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        
        Long userId = jwtUtils.getUserIdFromToken(token.substring(7));
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getFeed(userId, pageable));
    }

    @GetMapping("/circles")
    public ResponseEntity<Page<PostResponseDTO>> getCirclesFeed(
            @RequestHeader("Authorization") String token,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        
        String rawToken = token.substring(7);
        Long userId = jwtUtils.getUserIdFromToken(rawToken);
        if (userId == null) {
            String username = jwtUtils.getUsernameFromToken(rawToken);
            com.example.demo.model.User user = userRepository.findFirstByUsername(username).orElse(null);
            userId = (user != null) ? user.getId() : null;
        }
        
        if (userId == null) return ResponseEntity.status(401).build();

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getMatchedPosts(userId, pageable));
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<PostResponseDTO>> getTrendingFeed(
            @RequestHeader("Authorization") String token,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        
        Long userId = jwtUtils.getUserIdFromToken(token.substring(7));
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getTrendingPosts(userId, pageable));
    }

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestHeader("Authorization") String token,
            @RequestParam("content") String content,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "skillId", required = false) Long skillId,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        String rawToken = token.substring(7);
        Long userId = jwtUtils.getUserIdFromToken(rawToken);
        
        // Fallback for old tokens that only have username
        if (userId == null) {
            String username = jwtUtils.getUsernameFromToken(rawToken);
            if (username != null) {
                // If we don't have the context of PostService's user repo here, 
                // we'll let PostService handle the search or just inform the user.
                // But since PostService is injected, we can ideally call a more robust method.
            }
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = uploadImage(image);
        }

        return ResponseEntity.ok(postService.createPostWithFallback(userId, rawToken, content, title, imageUrl, skillId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") Long id,
            @RequestBody PostUpdateRequest request) {

        Long userId = jwtUtils.getUserIdFromToken(token.substring(7));
        return ResponseEntity.ok(postService.updatePost(id, userId, request.content, request.title));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") Long id) {

        Long userId = jwtUtils.getUserIdFromToken(token.substring(7));
        postService.deletePost(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Boolean> toggleLike(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") Long id) {

        Long userId = jwtUtils.getUserIdFromToken(token.substring(7));
        return ResponseEntity.ok(postService.toggleLike(id, userId));
    }

    private String uploadImage(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Invalid path sequence " + fileName);
            }
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = this.postImageStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/posts/" + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store post image.", ex);
        }
    }

    public static class PostUpdateRequest {
        public String content;
        public String title;
    }
}
