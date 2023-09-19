package com.tripplanner.BlogService.service.interfaces;

import com.tripplanner.BlogService.dto.request.BlogDetailsDTO;
import com.tripplanner.BlogService.dto.response.BlogGeneralDTO;
import com.tripplanner.BlogService.entity.Blog;
import java.util.ArrayList;
import java.util.List;

public interface BlogService {
  public BlogDetailsDTO getBlogById(int id);

  public List<Blog> getBlogByKeyWord(String keyword);

  List<BlogGeneralDTO> getLatestBlogs();
}
