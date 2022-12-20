package com.tripplanner.LocationService.dto;

import com.tripplanner.LocationService.entity.POI;
import lombok.Data;

import java.util.ArrayList;

@Data
public class ListPoi {
    ArrayList<POI> list;
    String additional;
}
