package com.tripplanner.TripService.dto;

import lombok.Data;

import javax.persistence.*;

@Data

public class Category {

    private int categoryID;

    private String categoryName;

    private String description;
}
