package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.*;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.ExpenseCategory;
import com.planner.backendserver.entity.TripExpense;
import com.planner.backendserver.repository.BlogRepository;
import com.planner.backendserver.repository.DestinationRepository;
import com.planner.backendserver.repository.ExpenseRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Calendar;

@RestController
@RequestMapping("/api")
public class BlogController {
    @Autowired
    private BlogRepository blogRepo;

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
}
