package com.tripplanner.BlogService.dto.response;

import com.tripplanner.BlogService.entity.BlogStatus;
import lombok.Data;

import java.util.Date;

@Data
public class BlogGeneralDTO {
    private int blogId;
    private  String title;
    private  String thumbnail;
    private Date dateCreated;
    private Date dateModified;
    private BlogStatus status;
}
