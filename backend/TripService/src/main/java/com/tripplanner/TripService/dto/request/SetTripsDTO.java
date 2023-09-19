package com.tripplanner.TripService.dto.request;

import lombok.Data;

@Data
public class SetTripsDTO {

  private int user;
  private int[] tripIds;
}
