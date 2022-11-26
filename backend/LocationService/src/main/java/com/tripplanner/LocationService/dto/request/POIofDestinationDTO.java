package com.tripplanner.LocationService.dto.request;

public interface POIofDestinationDTO {
    int getActivityId();
    String getName();
    String getCategoryName();
    double getGoogleRating();
    String getDescription();
    double getTypicalPrice();
    String getImage();
}
