package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.repository.CollectionRepository;
import com.tripplanner.LocationService.repository.POIImageRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.*;

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
}