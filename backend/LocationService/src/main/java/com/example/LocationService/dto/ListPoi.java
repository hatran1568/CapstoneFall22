package com.example.LocationService.dto;

import com.example.LocationService.entity.POI;
import lombok.Data;

import java.util.ArrayList;

@Data
public class ListPoi {
    ArrayList<POI> list;
    String additional;
}
