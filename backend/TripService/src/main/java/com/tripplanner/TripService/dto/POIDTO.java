package com.tripplanner.TripService.dto;

import com.tripplanner.TripService.dto.response.MasterActivityDTO;
import java.util.ArrayList;
import lombok.Data;

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
