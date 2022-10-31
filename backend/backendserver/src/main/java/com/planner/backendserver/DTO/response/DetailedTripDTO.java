package com.planner.backendserver.DTO.response;

import com.planner.backendserver.entity.TripDetails;
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
}
