package com.example.demo.community;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.user ORDER BY p.createdAt DESC")
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.id IN " +
           "(SELECT CASE WHEN m.user1Id = :userId THEN m.user2Id ELSE m.user1Id END " +
           "FROM Match m WHERE m.user1Id = :userId OR m.user2Id = :userId)")
    Page<Post> findMatchedPosts(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p LEFT JOIN LikePost l ON p.id = l.post.id " +
           "LEFT JOIN Comment c ON p.id = c.post.id " +
           "GROUP BY p.id " +
           "ORDER BY (count(DISTINCT l.id) * 2 + count(DISTINCT c.id)) DESC")
    Page<Post> findTrendingPosts(Pageable pageable);

    @Query("SELECT COUNT(l) FROM LikePost l WHERE l.post.id = :postId")
    long countLikesByPostId(@Param("postId") Long postId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    long countCommentsByPostId(@Param("postId") Long postId);

    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM LikePost l WHERE l.post.id = :postId AND l.user.id = :userId")
    boolean isLikedByUser(@Param("postId") Long postId, @Param("userId") Long userId);
}
