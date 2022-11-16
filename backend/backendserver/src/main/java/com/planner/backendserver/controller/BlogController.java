package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.request.BlogDetailsDTO;
import com.planner.backendserver.DTO.request.BlogListDTO;
import com.planner.backendserver.DTO.request.BlogNearbyDTO;
import com.planner.backendserver.DTO.request.UserIdDTO;
import com.planner.backendserver.DTO.response.BlogAddUpdateDTO;
import com.planner.backendserver.DTO.response.TripExpenseAddDTO;
import com.planner.backendserver.entity.Blog;
import com.planner.backendserver.entity.User;
import com.planner.backendserver.repository.BlogRepository;
import com.planner.backendserver.utils.GoogleDriveManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/blog/admin/{filter}/{page}")
    public ResponseEntity<ArrayList<BlogListDTO>> searchBlogsAdmin(@PathVariable String filter, @PathVariable int page){
        try{
            ArrayList<BlogListDTO> blogs = null;
            if (filter.equals("*"))
                blogs = blogRepo.getBlogsByKeywordAll("", page * 10, 10);
            else
                blogs = blogRepo.getBlogsByKeywordAll(filter, page * 10, 10);
            return new ResponseEntity<>(blogs, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/blog/admin/{filter}/{page}/count")
    public ResponseEntity<Integer> searchBlogsAdminCount(@PathVariable String filter, @PathVariable int page){
        try{
            Integer count = 0;
            if (filter.equals("*"))
                count = blogRepo.getBlogsByKeywordAllCount("", page * 10, 10);
            else
                count = blogRepo.getBlogsByKeywordAllCount(filter, page * 10, 10);
            return new ResponseEntity<>(count, HttpStatus.OK);
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
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/blog/new/{userId}", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public ResponseEntity<?> addBlog(@PathVariable int userId) {
//        try{
            java.sql.Timestamp date = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            blogRepo.addBlog(date, date, userId);
            return new ResponseEntity<>(blogRepo.getLastestBlog(), HttpStatus.OK);
//        }
//        catch (Exception e){
//            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }
    @RequestMapping(value = "/blog/hide/{blogId}", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> hideBlog(@PathVariable int blogId) {
        try{
            BlogDetailsDTO blog = blogRepo.getBlogById(blogId);
            if (blog == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            blogRepo.hideBlog(blogId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @RequestMapping(value = "/blog/unhide/{blogId}", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> unhideBlog(@PathVariable int blogId) {
        try{
            BlogDetailsDTO blog = blogRepo.getBlogById(blogId);
            if (blog == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            blogRepo.unhideBlog(blogId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @RequestMapping(value = "/blog/delete/{blogId}", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> deleteBlog(@PathVariable int blogId) {
        try{
            BlogDetailsDTO blog = blogRepo.getBlogById(blogId);
            if (blog == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            blogRepo.deleteBlog(blogId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/blog/update", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> updateExpense(@RequestBody BlogAddUpdateDTO blog) {
        try{
            java.sql.Timestamp date = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            String thumbnail = " ";
            String content = " ";
            String title = " ";
            if (blog.getThumbnail().length() > 0)
                thumbnail = blog.getThumbnail();
            if (blog.getContent().length() > 0)
                content = blog.getContent();
            if (blog.getTitle().length() > 0)
                title = blog.getTitle();

            blogRepo.updateBlog(blog.getBlogId(), thumbnail, title, blog.getStatus(), date, content);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
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
