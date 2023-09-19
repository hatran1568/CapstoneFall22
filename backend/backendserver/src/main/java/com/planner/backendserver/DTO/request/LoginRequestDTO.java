package com.planner.backendserver.dto.request;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {

  @NotBlank
  private String username;

  @NotBlank
  private String password;
}
