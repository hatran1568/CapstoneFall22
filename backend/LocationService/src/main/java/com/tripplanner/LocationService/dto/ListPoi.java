package com.tripplanner.LocationService.dto;

import com.tripplanner.LocationService.entity.POI;
import java.util.ArrayList;
import lombok.Data;

@Data
public class ListPoi {

  ArrayList<POI> list;
  String additional;
}
