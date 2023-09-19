package com.planner.backendserver.DTO.response;

import java.sql.Timestamp;

public interface DesListDTO {
  int getDesId();
  Timestamp getDateCreated();
  Timestamp getDateModified();
  String getName();
  String getBelongTo();
  int getPOIs();
}
