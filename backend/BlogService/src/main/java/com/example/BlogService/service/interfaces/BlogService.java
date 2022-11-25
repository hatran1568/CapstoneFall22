package com.example.BlogService.service.interfaces;

import com.example.BlogService.dto.request.BlogDetailsDTO;

public interface BlogService {
    public BlogDetailsDTO getBlogById(int id);
}
