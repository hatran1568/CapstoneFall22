package com.example.TripService.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Date;

@Data
@AllArgsConstructor
public class GenerateTripUserInput {
    private  String id;
    private Date startDate;
    private Date endDate;
    private int userId;
    private int DestinationId;
    private int budget;
    private int[] userPreference;

    private int startTime;
    private int endTime;


}
