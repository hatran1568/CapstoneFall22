package com.tripplanner.TripService.dto.response;

public interface TripDetailsQueryDTO {
    public int getDetailsId();
    public int getDayNumber();
    public int getStartTime();
    public  String getNote();
    public int getEndTime();
    public int getMasterActivity();
    public int getTripId();
}
