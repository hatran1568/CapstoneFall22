package com.tripplanner.LocationService.dto.response;

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
