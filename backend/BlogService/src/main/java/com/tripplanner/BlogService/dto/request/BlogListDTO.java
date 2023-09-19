package com.tripplanner.BlogService.dto.request;

import java.sql.Timestamp;

public interface BlogListDTO {
  int getBlogId();
  Timestamp getDateCreated();
  Timestamp getDateModified();
  String getStatus();
  String getThumbnail();
  String getTitle();
  String getUsername();
  String getAvatar();
}
