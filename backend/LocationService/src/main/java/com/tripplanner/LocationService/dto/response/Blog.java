package com.tripplanner.LocationService.dto.response;

import java.util.Date;
import lombok.Data;

@Data
public class Blog {

  private int blogId;

  private Integer user;

  private String title;

  private String content;

  private String thumbnail;

  private Date dateCreated;

  private Date dateModified;

  private BlogStatus status;
}
