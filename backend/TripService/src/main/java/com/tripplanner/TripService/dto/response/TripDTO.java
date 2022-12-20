package com.tripplanner.TripService.dto.response;

import java.sql.Date;

public class TripDTO {
    Integer userId;
    Double budget;
    String name;
    Date startDate;
    Date endDate;

    public int getUserId(){
        return userId;
    };
    public Double getBudget(){
        return budget;
    };
    public String getName(){
        return name;
    };
    public Date getStartDate(){
        return startDate;
    };
    public Date getEndDate(){
        return endDate;
    };
}
