package com.tripplanner.Optimizer.DTO.Response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailResponseDTO {
    private int userID;
    private String avatar;
    private String email;
    private String name;
    private RoleDTO role;
    private Date dateCreated;
}
