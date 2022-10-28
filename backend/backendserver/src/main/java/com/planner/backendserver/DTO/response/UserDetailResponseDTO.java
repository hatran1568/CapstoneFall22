package com.planner.backendserver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.planner.backendserver.dto.response.RoleDTO;
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
