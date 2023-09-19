package com.tripplanner.TripService.dto.request;

import java.sql.Date;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenerateTripUserInput {

  private String id;
  private Date startDate;
  private Date endDate;
  private int userId;
  private int DestinationId;
  private int budget;
  private int[] userPreference;

  private int startTime;
  private int endTime;
}
