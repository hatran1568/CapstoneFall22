package com.tripplanner.TripService.dto.request;

import java.sql.Date;
import lombok.Data;

@Data
public class TripGenerateDTO {

  private double budget;
  private String name;
  private int userId;
  private Date startDate;
  private Date endDate;
}
