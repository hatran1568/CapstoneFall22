package com.planner.backendserver.DTO.request;

import com.planner.backendserver.entity.BlogStatus;

import java.sql.Date;
import java.sql.Timestamp;

public interface BlogDetailsDTO {
    int getBlogId();
    Timestamp getDateModified();
    String getContent();
    BlogStatus getStatus();
    String getThumbnail();
    String getTitle();
    int getUserId();
    String getUsername();
    String getAvatar();
}
