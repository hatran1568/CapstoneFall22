package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.dto.response.CollectionDTO;
import com.tripplanner.LocationService.dto.response.POIOfCollectionDTO;
import com.tripplanner.LocationService.entity.Collection;
import com.tripplanner.LocationService.entity.CollectionPOI;
import com.tripplanner.LocationService.entity.POI;
import com.tripplanner.LocationService.entity.POIImage;
import com.tripplanner.LocationService.repository.CollectionRepository;
import com.tripplanner.LocationService.repository.POIImageRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import com.tripplanner.LocationService.service.interfaces.CollectionService;
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
            CollectionDTO collectionDTO = new CollectionDTO(collection.getCollectionId(), collection.getTitle(), collection.getDescription(), collection.getDateModified(), collection.isDeleted(), collection.getUser(), getFirstImageOfCollection(collection.getCollectionId()), getPOIListOfCollection(collection.getCollectionId()));
            if (!collectionDTO.isDeleted()) {
                list.add(collectionDTO);
            }
        }
        return list;
    }

    @Override
    public CollectionDTO getCollectionById(int colId) {
        Collection collection = collectionRepository.getCollectionByID(colId);
        return new CollectionDTO(collection.getCollectionId(), collection.getTitle(), collection.getDescription(), collection.getDateModified(), collection.isDeleted(), collection.getUser(), getFirstImageOfCollection(collection.getCollectionId()), getPOIListOfCollection(colId));
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
        ArrayList<POIOfCollectionDTO> POIList = getPOIListOfCollection(colId);
        if (POIList.size() == 0) {
            return null;
        }
        POIOfCollectionDTO rndmPOI = POIList.get(POIList.size() / 2);
        POIImage poiImage = poiImageRepository.findFirstByPoiId(rndmPOI.getActivityId());
        if (poiImage == null) {
            return null;
        }
        return poiImage.getUrl();
    }
}
