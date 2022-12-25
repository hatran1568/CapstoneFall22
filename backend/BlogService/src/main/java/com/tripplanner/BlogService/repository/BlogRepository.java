package com.tripplanner.BlogService.repository;


import com.tripplanner.BlogService.dto.request.BlogDetailsDTO;
import com.tripplanner.BlogService.dto.request.BlogListDTO;
import com.tripplanner.BlogService.dto.request.BlogNearbyDTO;
import com.tripplanner.BlogService.dto.response.BlogGeneralDTO;
import com.tripplanner.BlogService.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;

public interface BlogRepository extends JpaRepository<Blog,Integer> {
    @Query("SELECT b from Blog b where b.title like  CONCAT('%',:keyword,'%') AND b.status = 'PUBLISHED'")
    public ArrayList<Blog> getBlogsByKeyword(String keyword);
    @Query(
            value = "SELECT b.blog_id as blogId, b.date_created as dateCreated, b.date_modified as dateModified, b.status, b.thumbnail, b.title, u.name as username, u.avatar\n" +
                    "FROM blog b LEFT JOIN user u ON b.user_id = u.user_id\n" +
                    "WHERE b.title LIKE CONCAT('%',?1,'%') AND b.status != 'DELETED' LIMIT ?2, ?3",
            nativeQuery = true)
    ArrayList<BlogListDTO> getBlogsByKeywordAll(String keyword, int start, int count);
    @Query(
            value = "SELECT COUNT(*)\n" +
                    "FROM blog b LEFT JOIN user u ON b.user_id = u.user_id\n" +
                    "WHERE b.title LIKE CONCAT('%',?1,'%') AND b.status != 'DELETED' LIMIT ?2, ?3",
            nativeQuery = true)
    Integer getBlogsByKeywordAllCount(String keyword, int start, int count);
    @Query(
            value = "SELECT b.blog_id as blogId, b.date_modified as dateModified, b.content, b.status, b.thumbnail, b.title, u.user_id as userId, u.name as username, u.avatar, u.status as userStatus FROM blog b LEFT JOIN user u ON b.user_id = u.user_id WHERE b.blog_id = ?1",
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
            value = "INSERT INTO blog ( content, title, thumbnail, date_created, date_modified, status, user_id)\n" +
                    "VALUES (' ', ' ', ' ', ?1, ?2, 'DRAFT', ?3);",
            nativeQuery = true)
    void addBlog(Timestamp dateCreated, Timestamp dateModified, int userId);
    @Query(
            value = "SELECT blog_id as blogId FROM blog ORDER BY blog_id DESC LIMIT 1",
            nativeQuery = true)
    int getLastestBlog();
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE blog\n" +
                    "SET status = 'HIDDEN'\n" +
                    "WHERE blog_id = ?1",
            nativeQuery = true)
    void hideBlog(int blogId);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE blog\n" +
                    "SET status = 'PUBLISHED'\n" +
                    "WHERE blog_id = ?1",
            nativeQuery = true)
    void unhideBlog(int blogId);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE blog\n" +
                    "SET status = 'DELETED'\n" +
                    "WHERE blog_id = ?1",
            nativeQuery = true)
    void deleteBlog(int blogId);
    @Query(value="SELECT *" +
            " from blog b where b.status = 'PUBLISHED' " +
            " order by b.date_modified desc limit 3", nativeQuery = true)
    ArrayList<Blog> getLatestBlogs();
}
