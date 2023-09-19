package com.tripplanner.TripService.dto.response;

import java.sql.Date;
import lombok.Data;

@Data
public class TripDetailDTO {

  private int tripDetailsId;
  private MasterActivityDTO masterActivity;
  private int startTime;
  private int endTime;
  private Date date;
  private String note;
  private int dayNumber;
}
