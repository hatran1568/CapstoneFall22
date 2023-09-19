package com.planner.backendserver.DTO.response;

import java.sql.Timestamp;

public interface RequestListDTO {
  int getRequestId();
  Timestamp getModified();
  Timestamp getCreated();
  int getUserId();
  String getUsername();
  String getAvatar();
  int getPoiId();
  String getPoiName();
  String getStatus();
}
