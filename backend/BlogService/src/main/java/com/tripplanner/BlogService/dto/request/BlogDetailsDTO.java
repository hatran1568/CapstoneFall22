package com.tripplanner.BlogService.dto.request;

import com.tripplanner.BlogService.entity.BlogStatus;
import java.sql.Timestamp;
import lombok.Data;

@Data
public class BlogDetailsDTO {

  private int blogId;
  private Timestamp dateModified;
  private String content;
  private BlogStatus status;
  private String thumbnail;
  private String title;
  private int userId;
  private String username;
  private String avatar;
  private String userStatus;
}
