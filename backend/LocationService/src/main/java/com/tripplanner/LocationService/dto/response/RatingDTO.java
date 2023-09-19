package com.tripplanner.LocationService.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingDTO {

  private int rateId;
  private int rate;
  private String comment;
  private boolean deleted;
  private Date created;
  private Date modified;
  private int userId;
  private String userName;
  private int poiId;
}
