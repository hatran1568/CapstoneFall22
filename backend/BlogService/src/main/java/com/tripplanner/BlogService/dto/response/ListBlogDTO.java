package com.tripplanner.BlogService.dto.response;

import com.tripplanner.BlogService.entity.Blog;
import java.util.List;
import lombok.Data;

@Data
public class ListBlogDTO {

  private String test;
  private List<Blog> list;
}
