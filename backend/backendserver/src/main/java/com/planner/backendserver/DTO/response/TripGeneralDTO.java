package com.planner.backendserver.dto.response;

import com.planner.backendserver.entity.TripStatus;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
public class TripGeneralDTO {

    private String image;
    private int tripId;
    private double budget;
    private Date startDate;
    private Date endDate;
    private String name;
    private Date dateModified;
    private TripStatus status;
    private int userID;
}
