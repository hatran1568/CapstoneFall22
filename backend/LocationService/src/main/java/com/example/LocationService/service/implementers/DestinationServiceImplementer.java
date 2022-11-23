package com.example.LocationService.service.implementers;

import com.example.LocationService.entity.Destination;
import com.example.LocationService.repository.DestinationRepository;
import com.example.LocationService.service.interfaces.DestinationService;

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
