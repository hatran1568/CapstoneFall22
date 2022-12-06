package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.entity.Destination;
import com.tripplanner.LocationService.repository.DestinationRepository;
import com.tripplanner.LocationService.service.interfaces.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class DestinationServiceImplementer implements DestinationService {
    @Autowired
    DestinationRepository destinationRepository;

    @Override
    public ArrayList<Destination> searchDestinationByKeyword(String keyword) {
        return destinationRepository.getDestinationsByKeyword(keyword);
    }
}
