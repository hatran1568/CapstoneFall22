package com.tripplanner.LocationService.dto;

import com.tripplanner.LocationService.dto.response.MasterActivityDTO;
import com.tripplanner.LocationService.entity.Category;
import com.tripplanner.LocationService.entity.POIImage;

import lombok.Data;

import java.util.ArrayList;

@Data
public class POIDTO extends MasterActivityDTO {
    private Category category;
    private double googleRate;
    private String Description;
    private int openTime;
    private int duration;
    private int closeTime;
    private double typicalPrice;
    private ArrayList<POIImage> images;
    private String website;
}
