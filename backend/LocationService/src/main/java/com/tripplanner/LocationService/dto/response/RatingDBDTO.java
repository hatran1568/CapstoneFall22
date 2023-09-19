package com.tripplanner.LocationService.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public interface RatingDBDTO {
  int getRateId();

  String getComment();

  Date getCreated();

  Date getModified();

  boolean getDeleted();

  int getRate();

  int getPoiId();

  int getUserId();
}
