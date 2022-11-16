package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.response.CollectionDTO;
import com.planner.backendserver.DTO.response.POIOfCollectionDTO;
import com.planner.backendserver.entity.Collection;
import com.planner.backendserver.entity.CollectionPOI;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.POIImage;
import com.planner.backendserver.repository.CollectionRepository;
import com.planner.backendserver.repository.POIImageRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.interfaces.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CollectionServiceImpl implements CollectionService {
    @Autowired
    CollectionRepository collectionRepository;

    @Autowired
    POIRepository poiRepository;

    @Autowired
    POIImageRepository poiImageRepository;

    @Override
    public ArrayList<CollectionDTO> getCollectionListByUid(int uid) {
        ArrayList<CollectionDTO> list = new ArrayList<>();
        ArrayList<Collection> collections = collectionRepository.getCollectionsByUserID(uid);
        for (Collection collection : collections) {
            CollectionDTO collectionDTO = new CollectionDTO(collection.getCollectionId(), collection.getTitle(), collection.getDescription(), collection.getDateModified(), collection.isDeleted(), collection.getUser().getUserID(), getFirstImageOfCollection(collection.getCollectionId()), getPOIListOfCollection(collection.getCollectionId()));
            if (!collectionDTO.isDeleted()) {
                list.add(collectionDTO);
            }
        }
        return list;
    }

    @Override
    public CollectionDTO getCollectionById(int colId) {
        Collection collection = collectionRepository.getCollectionByID(colId);
        return new CollectionDTO(collection.getCollectionId(), collection.getTitle(), collection.getDescription(), collection.getDateModified(), collection.isDeleted(), collection.getUser().getUserID(), getFirstImageOfCollection(collection.getCollectionId()), getPOIListOfCollection(colId));
    }

    @Override
    public void deletePOIFromCollection(int colID, int poiId) {
        collectionRepository.removePOIFromCollection(colID, poiId);
    }

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
