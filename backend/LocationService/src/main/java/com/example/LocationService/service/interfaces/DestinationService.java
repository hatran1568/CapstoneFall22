package com.example.LocationService.service.interfaces;

import com.example.LocationService.entity.Destination;


import java.util.ArrayList;

public interface DestinationService {
    public ArrayList<Destination> searchDestinationByKeyword(String keyword);
}
