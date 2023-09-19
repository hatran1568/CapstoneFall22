package com.tripplanner.LocationService.dto.response;

import java.sql.Timestamp;

public interface DesListDTO {
  int getDesId();
  Timestamp getDateCreated();
  Timestamp getDateModified();
  String getName();
  String getBelongTo();
  int getPOIs();
}
