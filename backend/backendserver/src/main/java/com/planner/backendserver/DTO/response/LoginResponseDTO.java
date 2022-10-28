package com.planner.backendserver.dto.response;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String accessToken;

    private String role;
    private int id;
    public LoginResponseDTO(String accessToken,String role,int id) {
        this.accessToken = accessToken;
        this.role = role;
        this.id =id;
    }
}