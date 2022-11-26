package com.example.BlogService.dto.response;

import com.example.BlogService.entity.Blog;
import lombok.Data;

import java.util.List;
@Data
public class ListBlogDTO {
   private  String test;
   private List<Blog> list;
}
