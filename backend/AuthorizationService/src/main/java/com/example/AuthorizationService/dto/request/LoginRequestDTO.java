package com.example.AuthorizationService.dto.request;

import lombok.Data;
import javax.validation.constraints.NotBlank;
@Data
public class LoginRequestDTO {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
