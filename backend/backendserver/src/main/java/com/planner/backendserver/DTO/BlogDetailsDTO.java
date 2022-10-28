package com.planner.backendserver.DTO;

import com.planner.backendserver.entity.BlogStatus;

import java.sql.Date;

public interface BlogDetailsDTO {
    int getBlogId();
    String getContent();
    BlogStatus getStatus();
    String getThumbnail();
    String getTitle();
    int getUserId();
    String getUsername();
    String getAvatar();
}
