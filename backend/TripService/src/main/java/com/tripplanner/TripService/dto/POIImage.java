package com.tripplanner.TripService.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
public class POIImage {

  private int imageId;

  @JsonIgnore
  private POIDTO poi;

  private String url;

  private String description;
}
