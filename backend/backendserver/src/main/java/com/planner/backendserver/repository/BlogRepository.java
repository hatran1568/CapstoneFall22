package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.BlogDetailsDTO;
import com.planner.backendserver.DTO.BlogNearbyDTO;
import com.planner.backendserver.entity.Blog;
import com.planner.backendserver.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface BlogRepository  extends JpaRepository<Blog,Integer> {
    @Query("SELECT b from Blog b where b.title like  CONCAT('%',:keyword,'%')")
    public ArrayList<Blog> getBlogsByKeyword(String keyword);

    @Query(
            value = "SELECT b.blog_id as blogId, b.content, b.status, b.thumbnail, b.title, u.user_id as userId, u.name as username, u.avatar FROM blog b LEFT JOIN user u ON b.user_id = u.user_id WHERE b.blog_id = ?1",
            nativeQuery = true)
    BlogDetailsDTO getBlogById(int blogId);
    @Query(
            value = "(SELECT b.blog_id as blogId, b.title FROM blog b WHERE b.blog_id < ?1 AND b.status = 'PUBLISHED' ORDER BY b.blog_id DESC LIMIT 1)\n" +
                    "UNION\n" +
                    "(SELECT b.blog_id as blogId, b.title FROM blog b WHERE b.blog_id > ?1 AND b.status = 'PUBLISHED' LIMIT 1)",
            nativeQuery = true)
    ArrayList<BlogNearbyDTO> getNearbyBlogTitle(int blogId);
    @Query(
            value = "SELECT b.blog_id as blogId, b.title FROM blog b WHERE b.status = 'PUBLISHED' ORDER BY b.blog_id DESC LIMIT 1",
            nativeQuery = true)
    BlogNearbyDTO getLastBlogTitle();
    @Query(
            value = "SELECT b.blog_id as blogId, b.title FROM blog b WHERE b.status = 'PUBLISHED' LIMIT 1",
            nativeQuery = true)
    BlogNearbyDTO getFirstBlogTitle();
}
