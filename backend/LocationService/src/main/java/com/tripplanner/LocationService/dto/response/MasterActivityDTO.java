package com.tripplanner.LocationService.dto.response;

import lombok.Data;

@Data
public class MasterActivityDTO {

  protected int activityId;
  protected String name;
  protected String address;
  protected boolean isCustom;
  protected Double latitude;
  protected Double longitude;
}
