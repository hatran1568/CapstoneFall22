package com.tripplanner.TripService.dto.response;

import com.tripplanner.TripService.entity.TripStatus;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;

@Data
public class DetailedTripDTO {
    private int tripId;
    private double budget;
    private Date startDate;
    private Date endDate;
    private String name;
    private Date dateModified;
    private ArrayList<TripDetailDTO> listTripDetails;
    private int user;
    private TripStatus status;
}
