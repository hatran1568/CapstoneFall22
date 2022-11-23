package com.example.TripService.dto.request;

import lombok.Data;

import java.sql.Date;

@Data
public class TripGenerateDTO {
 private double budget;
 private String name;
 private  int userId;
 private Date startDate;
 private  Date endDate;
}
