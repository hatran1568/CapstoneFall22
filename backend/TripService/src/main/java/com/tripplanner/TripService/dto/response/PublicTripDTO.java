package com.tripplanner.TripService.dto.response;

import com.tripplanner.TripService.entity.TripStatus;
import java.util.ArrayList;
import java.util.Date;
import lombok.Data;

@Data
public class PublicTripDTO {

  private String image;
  private int tripId;
  private double budget;
  private Date startDate;
  private Date endDate;
  private String name;
  private Date dateCreated;
  private TripStatus status;
  private int userID;
  private ArrayList<String> destinations;
  private ArrayList<String> pois;
  private Integer numberOfDays;
}
