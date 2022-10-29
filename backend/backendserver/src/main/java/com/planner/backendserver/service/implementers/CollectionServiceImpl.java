package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.response.CollectionDTO;
import com.planner.backendserver.entity.Collection;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.POIImage;
import com.planner.backendserver.repository.CollectionRepository;
import com.planner.backendserver.repository.POIImageRepository;
import com.planner.backendserver.service.interfaces.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CollectionServiceImpl implements CollectionService {
    @Autowired
    CollectionRepository collectionRepository;

    @Autowired
    POIImageRepository poiImageRepository;

    @Override
    public ArrayList<CollectionDTO> getCollectionListByUid(int uid) {
        ArrayList<CollectionDTO> list = new ArrayList<>();
        ArrayList<Collection> collections = collectionRepository.getCollectionsByUserID(uid);
        for (Collection collection : collections) {
            CollectionDTO collectionDTO = new CollectionDTO(collection.getCollectionId(), collection.getTitle(), collection.getDescription(), collection.getDateModified(), collection.isDeleted(), collection.getUser().getUserID(), getFirstImageOfCollection(collection.getCollectionId()));
            list.add(collectionDTO);
        }
        return list;
    }

    private String getFirstImageOfCollection(int colId) {
        POI collectionPOI = collectionRepository.getFirstPOIInCollection(colId);
        if (collectionPOI == null) {
            return null;
        }
        POIImage poiImage = poiImageRepository.findFirstByPoiId(collectionPOI.getActivityId());
        if (poiImage == null) {
            return null;
        }
        return poiImage.getUrl();
    }
}
