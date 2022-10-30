package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.response.POIOfCollectionDTO;
import com.planner.backendserver.entity.CollectionPOI;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.POIImage;
import com.planner.backendserver.repository.CollectionRepository;
import com.planner.backendserver.repository.POIImageRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.interfaces.POIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class POIServiceImpl implements POIService {

    @Autowired
    CollectionRepository collectionRepository;

    @Autowired
    POIRepository poiRepository;

    @Autowired
    POIImageRepository poiImageRepository;

    @Override
    public ArrayList<POIOfCollectionDTO> getPOIListOfCollection(int colId) {
        ArrayList<POIOfCollectionDTO> list = new ArrayList<>();
        ArrayList<CollectionPOI> collectionPOIS = collectionRepository.getPOIListOfCollectionByID(colId);
        for (CollectionPOI cp : collectionPOIS) {
            Optional<POI> poi = poiRepository.getPOIByMasterActivity(cp.getPoi().getActivityId());
            if (poi.isPresent()) {
                POIImage img = poiImageRepository.findFirstByPoiId(poi.get().getActivityId());
                POIOfCollectionDTO poiOfCollectionDTO = new POIOfCollectionDTO(poi.get().getActivityId(), poi.get().getName(), poi.get().getAddress(), poi.get().getCategory().getCategoryName(), poi.get().getGoogleRate(), img.getUrl());
                list.add(poiOfCollectionDTO);
            }
        }
        return list;
    }
}
