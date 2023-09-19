package com.tripplanner.LocationService.dto.response;

public interface POIUpdateDTO {
  int getActivityId();
  String getAddress();
  String getName();
  String getDescription();
  String getAdditionalInfo();
  String getEmail();
  int getOpeningTime();
  int getClosingTime();
  int getDuration();
  double getPrice();
  double getRating();
  String getPhoneNumber();
  String getWebsite();
  int getCategoryId();
  String getCategoryName();
  double getLat();
  double getLon();
}
