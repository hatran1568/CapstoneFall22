package com.tripplanner.LocationService.service.interfaces;


import com.tripplanner.LocationService.dto.response.CollectionDTO;
import com.tripplanner.LocationService.dto.response.POIOfCollectionDTO;

import java.util.ArrayList;

public interface CollectionService {
    ArrayList<CollectionDTO> getCollectionListByUid(int uid);
    CollectionDTO getCollectionById(int colId);
    ArrayList<POIOfCollectionDTO> getPOIListOfCollection(int colId);
    void deletePOIFromCollection(int colID, int poiId);
}
