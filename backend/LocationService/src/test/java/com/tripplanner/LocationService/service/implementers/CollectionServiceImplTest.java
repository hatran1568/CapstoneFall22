package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.dto.response.CollectionDTO;
import com.tripplanner.LocationService.dto.response.POIOfCollectionDTO;
import com.tripplanner.LocationService.entity.Collection;
import com.tripplanner.LocationService.entity.CollectionPOI;
import com.tripplanner.LocationService.entity.POI;
import com.tripplanner.LocationService.repository.CollectionRepository;
import com.tripplanner.LocationService.repository.POIImageRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.Mockito.*;

@SpringBootTest
class CollectionServiceImplTest {
    @Autowired
    private CollectionServiceImpl service;

    @MockBean
    private CollectionRepository colRepo;

    @MockBean
    private POIRepository poiRepo;

    @MockBean
    private POIImageRepository poiImgRepo;

    @Test
    void getCollectionListByUidTest() {
        ArrayList<Collection> list = new ArrayList<>();
        list.add(new Collection());
        list.add(new Collection());
        list.add(new Collection());
        doReturn(list).when(colRepo).getCollectionsByUserID(1);

        ArrayList<CollectionDTO> returnedList = service.getCollectionListByUid(1);

        Assertions.assertEquals(returnedList.size(), list.size());
    }

    @Test
    void getCollectionByIdTest() {
        Collection collection = new Collection();
        collection.setCollectionId(1);
        doReturn(collection).when(colRepo).getCollectionByID(1);

        CollectionDTO returnedCol = service.getCollectionById(1);

        Assertions.assertEquals(returnedCol.getCollectionId(), collection.getCollectionId());
    }

    @Test
    void deletePOIFromCollectionTest() {
        doNothing().when(colRepo).removePOIFromCollection(1, 1);

        service.deletePOIFromCollection(1, 1);

        verify(colRepo, times(1)).removePOIFromCollection(1, 1);
    }
}