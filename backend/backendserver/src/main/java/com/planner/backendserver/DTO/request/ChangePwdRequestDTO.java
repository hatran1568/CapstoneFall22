package com.planner.backendserver.dto.request;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePwdRequestDTO {

  @NotBlank
  private int id;

  @NotBlank
  private String oldPassword;

  @NotBlank
  private String newPassword;

  @NotBlank
  private String confirmPassword;
}
