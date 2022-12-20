package com.tripplanner.Optimizer.DTO.request;

import lombok.Data;

@Data
public class TripDetailsGenerateDTO {
 private String date;
 private String startTime;
 private String endTime;
 private String tripId;
 private  String activityId;
 private String note;

}
