package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.request.BlogDetailsDTO;
import com.planner.backendserver.DTO.request.BlogNearbyDTO;
import com.planner.backendserver.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;

public interface BlogRepository  extends JpaRepository<Blog,Integer> {
    @Query("SELECT b from Blog b where b.title like  CONCAT('%',:keyword,'%') AND b.status = 'PUBLISHED'")
    public ArrayList<Blog> getBlogsByKeyword(String keyword);

    @Query(
            value = "SELECT b.blog_id as blogId, b.date_modified as dateModified, b.content, b.status, b.thumbnail, b.title, u.user_id as userId, u.name as username, u.avatar FROM blog b LEFT JOIN user u ON b.user_id = u.user_id WHERE b.blog_id = ?1",
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
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE blog\n" +
                    "SET thumbnail = ?2, title = ?3, status = ?4,\n" +
                    "    date_modified = ?5, content = ?6\n" +
                    "WHERE blog_id = ?1",
            nativeQuery = true)
    void updateBlog(int blogId, String thumbnail, String title, String status, Timestamp dateModified, String content);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO blog ( content, date_created, date_modified, status, thumbnail, title, user_id)\n" +
                    "VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7);",
            nativeQuery = true)
    void addBlog(String content, Timestamp dateCreated, Timestamp dateModified, String status, String thumbnail, String title, int userId);

}
