package com.planner.backendserver.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Builder
public class TripGeneralDTO {

    private String image;
    private int tripId;
    private double budget;
    private Date startDate;
    private Date endDate;
    private String name;
    private Date dateModified;

}
