package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.config.RestTemplateClient;
import com.tripplanner.LocationService.repository.DestinationRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.discovery.DiscoveryClient;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SearchServiceImplTest {
    @Autowired
    private SearchServiceImpl service;

    @MockBean
    private POIRepository poiRepo;

    @MockBean
    private DestinationRepository destinationRepo;

    @MockBean
    private RestTemplateClient restTemplateClient;

    @MockBean
    private DiscoveryClient discoveryClient;

    @Test
    void
}