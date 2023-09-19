package com.planner.backendserver.DTO.request;

import java.sql.Timestamp;

public interface POIListDTO {
  int getActivityId();
  String getName();
  double getRating();
  String getWebsite();
  String getPhoneNumber();
  String getCategoryName();
  int getCategoryId();
  Timestamp getDateCreated();
  Timestamp getDateModified();
}
