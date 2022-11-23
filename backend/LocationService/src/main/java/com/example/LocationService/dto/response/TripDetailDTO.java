package com.example.LocationService.dto.response;

import lombok.Data;

import java.sql.Date;

@Data

public class TripDetailDTO {
    private int tripDetailsId;
    private MasterActivityDTO masterActivity;
    private  int startTime;
    private  int endTime;
    private Date date;
    private String note;
    private int dayNumber;
}
