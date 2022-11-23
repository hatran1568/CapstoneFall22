package com.example.TripService.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data

public class POIImage {

    private int imageId;


    @JsonIgnore
    private POIDTO poi;


    private String url;

    private String description;
}
