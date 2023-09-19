package com.tripplanner.Optimizer.DTO;

import java.util.Date;
import java.util.List;
import lombok.Data;

@Data
public class Trip {

  private int tripId;

  private Integer user;

  private double budget;

  private Date startDate;

  private Date endDate;

  private String name;

  private Date dateCreated;

  private Date dateModified;

  private TripStatus status;
  private List<TripDetails> listTripDetails;
}
