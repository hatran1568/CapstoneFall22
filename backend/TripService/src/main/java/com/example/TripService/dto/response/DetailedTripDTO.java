package com.example.TripService.dto.response;

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
    private int userID;
}
