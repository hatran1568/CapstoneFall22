package com.planner.backendserver.DTO;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String accessToken;

    private String role;
    public LoginResponseDTO(String accessToken,String role) {
        this.accessToken = accessToken;
        this.role = role;
    }
}
