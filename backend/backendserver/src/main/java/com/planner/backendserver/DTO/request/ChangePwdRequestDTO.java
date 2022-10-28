package com.planner.backendserver.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

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
