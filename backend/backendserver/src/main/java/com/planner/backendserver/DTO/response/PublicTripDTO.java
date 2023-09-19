package com.planner.backendserver.DTO.response;

import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.TripStatus;
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
