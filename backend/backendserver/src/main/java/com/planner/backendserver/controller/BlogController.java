package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.request.BlogDetailsDTO;
import com.planner.backendserver.DTO.request.BlogNearbyDTO;
import com.planner.backendserver.DTO.response.BlogAddUpdateDTO;
import com.planner.backendserver.DTO.response.TripExpenseAddDTO;
import com.planner.backendserver.entity.User;
import com.planner.backendserver.repository.BlogRepository;
import com.planner.backendserver.utils.GoogleDriveManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Calendar;

@RestController
@RequestMapping("/api")
public class BlogController {
    @Autowired
    private BlogRepository blogRepo;
    @Autowired
    GoogleDriveManager driveManager;
    @GetMapping("/blog/{blogId}")
    public ResponseEntity<BlogDetailsDTO> getBlogDetailsById(@PathVariable int blogId){
        try{
            BlogDetailsDTO blog = blogRepo.getBlogById(blogId);
            if (blog == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(blog, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/blog/nearby/{blogId}")
    public ResponseEntity<ArrayList<BlogNearbyDTO>> getNearbyBlogs(@PathVariable int blogId){
        try{
            ArrayList<BlogNearbyDTO> blogs = blogRepo.getNearbyBlogTitle(blogId);
            if (blogs.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            BlogNearbyDTO firstBlog = blogRepo.getFirstBlogTitle();
            BlogNearbyDTO lastBlog = blogRepo.getLastBlogTitle();
            if (blogId == firstBlog.getBlogId())
                blogs.add(0, lastBlog);
            if (blogId == lastBlog.getBlogId())
                blogs.add(firstBlog);
            return new ResponseEntity<>(blogs, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //@PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/blog/new", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> addBlog(@RequestBody BlogAddUpdateDTO blog) {
        try{
            java.sql.Timestamp date = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            blogRepo.addBlog(blog.getContent(), date, date, blog.getStatus(), blog.getThumbnail(), blog.getTitle(), blog.getUserId());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //@PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/blog/update", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> updateExpense(@RequestBody BlogAddUpdateDTO blog) {
        try{
            java.sql.Timestamp date = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            blogRepo.updateBlog(blog.getBlogId(), blog.getThumbnail(), blog.getTitle(), blog.getStatus(), date, blog.getContent());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //@PreAuthorize("hasAuthority('Admin')")
    @PostMapping("/blog/uploadImg")
    @ResponseBody
    public ResponseEntity<String> uploadImg(@RequestPart("File") MultipartFile file){
        try{
            String webViewLink = null;
            try {
                webViewLink = driveManager.uploadFile(file, "tripplanner/img/blog");
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            } finally {

            }
            return new ResponseEntity<>(webViewLink, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
