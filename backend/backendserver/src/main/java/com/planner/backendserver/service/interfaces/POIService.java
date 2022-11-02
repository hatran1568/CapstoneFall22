package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.POIOfCollectionDTO;

import java.util.ArrayList;

public interface POIService {
    ArrayList<POIOfCollectionDTO> getPOIListOfCollection(int colId);
}
