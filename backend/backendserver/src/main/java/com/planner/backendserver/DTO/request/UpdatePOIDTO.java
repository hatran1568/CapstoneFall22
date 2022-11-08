package com.planner.backendserver.DTO.request;

import java.sql.Timestamp;

public class UpdatePOIDTO {
    int activityId;
    String address;
    String name;
    String description;
    String additionalInfo;
    String email;
    int closingTime;
    int openingTime;
    int duration;
    String phoneNumber;
    double price;
    String website;
    int categoryId;

    public int getActivityId() {
        return activityId;
    }

    public String getAddress() {
        return address;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public String getEmail() {
        return email;
    }

    public int getClosingTime() {
        return closingTime;
    }

    public int getOpeningTime() {
        return openingTime;
    }

    public int getDuration() {
        return duration;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public double getPrice() {
        return price;
    }

    public String getWebsite() {
        return website;
    }

    public int getCategoryId() {
        return categoryId;
    }
}
