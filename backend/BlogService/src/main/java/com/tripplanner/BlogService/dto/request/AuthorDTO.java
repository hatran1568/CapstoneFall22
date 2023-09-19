package com.tripplanner.BlogService.dto.request;

import lombok.Data;

@Data
public class AuthorDTO {

  private int userId;
  private String username;
  private String avatar;
  private String userStatus;
}
