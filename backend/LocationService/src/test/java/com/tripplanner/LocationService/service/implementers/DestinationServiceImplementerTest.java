package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.entity.Destination;
import com.tripplanner.LocationService.repository.DestinationRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;

import static org.mockito.Mockito.doReturn;

@SpringBootTest
class DestinationServiceImplementerTest {
    @MockBean
    DestinationRepository repo;
    @Autowired
    private DestinationServiceImplementer service;

    @Test
    void searchDestinationByKeywordTest() {
        ArrayList<Destination> list = new ArrayList<>();
        Destination destination = new Destination();
        destination.setName("Ha Noi");
        list.add(destination);
        doReturn(list).when(repo).getDestinationsByKeyword("ha");

        ArrayList<Destination> returnedList = service.searchDestinationByKeyword("ha");

        Assertions.assertEquals(returnedList, list);
    }
}