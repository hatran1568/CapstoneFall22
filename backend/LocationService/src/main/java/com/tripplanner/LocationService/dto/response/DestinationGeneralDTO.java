package com.tripplanner.LocationService.dto.response;

import lombok.Data;

@Data
public class DestinationGeneralDTO {

  private int destinationId;
  private String name;
  private String description;
  private String thumbnail;
}
