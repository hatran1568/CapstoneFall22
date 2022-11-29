package com.planner.backendserver.DTO.request;


public class NewRequestDTO {
    String name;
    String address;
    String description;
    String info;
    String email;
    String phone;
    int close;
    int open;
    int duration;
    double price;
    String website;
    int poiId;
    int userId;

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }

    public String getInfo() {
        return info;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public int getClose() {
        return close;
    }

    public int getOpen() {
        return open;
    }

    public int getDuration() {
        return duration;
    }

    public double getPrice() {
        return price;
    }

    public String getWebsite() {
        return website;
    }

    public int getPoiId() {
        return poiId;
    }

    public int getUserId() {
        return userId;
    }
}
