package com.tripplanner.TripService.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimpleResponse {

  private String id;
  private RequestStatus status;
  private int userID;
  String port;
}
