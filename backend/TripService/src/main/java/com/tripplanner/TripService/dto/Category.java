package com.tripplanner.TripService.dto;

import javax.persistence.*;
import lombok.Data;

@Data
public class Category {

  private int categoryID;

  private String categoryName;

  private String description;
}
