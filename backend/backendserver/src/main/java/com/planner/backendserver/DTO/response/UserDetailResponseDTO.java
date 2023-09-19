package com.planner.backendserver.dto.response;

import com.planner.backendserver.dto.response.RoleDTO;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
