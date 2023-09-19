package com.tripplanner.LocationService.service.implementers;

import static org.mockito.Mockito.*;

import com.tripplanner.LocationService.dto.response.CollectionDTO;
import com.tripplanner.LocationService.dto.response.POIOfCollectionDTO;
import com.tripplanner.LocationService.entity.*;
import com.tripplanner.LocationService.repository.CollectionRepository;
import com.tripplanner.LocationService.repository.POIImageRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Optional;
import java.util.concurrent.Executor;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

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

    Assertions.assertEquals(
      returnedCol.getCollectionId(),
      collection.getCollectionId()
    );
  }

  @Test
  void deletePOIFromCollectionTest() {
    doNothing().when(colRepo).removePOIFromCollection(1, 1);

    service.deletePOIFromCollection(1, 1);

    verify(colRepo, times(1)).removePOIFromCollection(1, 1);
  }

  @Test
  void getPOIListOfCollectionTest() {
    POI poi = new POI();
    poi.setActivityId(1);
    poi.setName("");
    poi.setAddress("");
    poi.setGoogleRate(4);
    Category cat = new Category();
    cat.setCategoryName("");
    poi.setCategory(cat);
    Collection col = new Collection();
    col.setCollectionId(1);
    CollectionPOI colPoi = new CollectionPOI();
    colPoi.setPoi(poi);
    colPoi.setCollection(col);
    ArrayList<CollectionPOI> list = new ArrayList<>();
    list.add(colPoi);
    doReturn(list).when(colRepo).getPOIListOfCollectionByID(1);
    Optional<POI> poiOptional = Optional.of(poi);
    doReturn(poiOptional).when(poiRepo).getPOIByMasterActivity(1);
    POIImage img = new POIImage();
    img.setImageId(1);
    img.setPoi(poi);
    img.setUrl("");
    doReturn(img).when(poiImgRepo).findFirstByPoiId(1);

    ArrayList<POIOfCollectionDTO> returnedList = service.getPOIListOfCollection(
      1
    );

    Assertions.assertEquals(returnedList.size(), list.size());
  }
}
