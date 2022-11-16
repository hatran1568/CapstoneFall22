package com.planner.backendserver.DTO.response;

import java.sql.Timestamp;

public interface UserListDTO {
    int getUserId();
    String getAvatar();
    Timestamp getCreated();
    Timestamp getModified();
    String getEmail();
    String getName();
    int getRoleId();
    String getRoleName();
    int getTrips();
}
