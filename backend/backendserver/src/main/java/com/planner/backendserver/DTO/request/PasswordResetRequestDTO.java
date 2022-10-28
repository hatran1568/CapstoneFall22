package com.planner.backendserver.dto.request;

import lombok.Data;

@Data
public class PasswordResetRequestDTO {
    private String email;
    private String resetToken;
    private String newPassword;
}
