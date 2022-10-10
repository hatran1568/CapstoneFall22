package com.planner.backendserver.DTO;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String email;
    private String password;
    private String username;

}
