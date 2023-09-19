package com.planner.backendserver.DTO.response;

import com.planner.backendserver.entity.Category;
import com.planner.backendserver.entity.POIImage;
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
  private String website;
  private ArrayList<POIImage> images;
}
