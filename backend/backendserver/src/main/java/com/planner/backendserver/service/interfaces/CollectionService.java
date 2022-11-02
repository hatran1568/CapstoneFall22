package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.CollectionDTO;
import com.planner.backendserver.DTO.response.POIOfCollectionDTO;

import java.util.ArrayList;

public interface CollectionService {
    ArrayList<CollectionDTO> getCollectionListByUid(int uid);
    CollectionDTO getCollectionById(int colId);
    ArrayList<POIOfCollectionDTO> getPOIListOfCollection(int colId);
    void deletePOIFromCollection(int colID, int poiId);
}
