package com.example.BlogService.service.interfaces;

import com.example.BlogService.dto.request.BlogDetailsDTO;
import com.example.BlogService.entity.Blog;

import java.util.List;

public interface BlogService {
    public BlogDetailsDTO getBlogById(int id);
    public List<Blog> getBlogByKeyWord(String keyword);
}
