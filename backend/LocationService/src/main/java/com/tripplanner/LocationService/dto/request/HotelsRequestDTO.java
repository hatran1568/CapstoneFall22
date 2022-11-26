package com.tripplanner.LocationService.dto.request;

import lombok.Data;

@Data
public class HotelsRequestDTO {
    private int poiId;
    private int page;
    private double distance;
    private int price;
    private int rate;

}