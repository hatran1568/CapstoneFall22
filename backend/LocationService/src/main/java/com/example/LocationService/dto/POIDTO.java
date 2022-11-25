package com.example.LocationService.dto;

import com.example.LocationService.dto.response.MasterActivityDTO;
import com.example.LocationService.entity.Category;
import com.example.LocationService.entity.POIImage;

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
