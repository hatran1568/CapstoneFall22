package com.tripplanner.UserService.dto.request;

import lombok.Data;

@Data
public class RegisterRequestDTO {

  private String email;
  private String password;
  private String username;
}
