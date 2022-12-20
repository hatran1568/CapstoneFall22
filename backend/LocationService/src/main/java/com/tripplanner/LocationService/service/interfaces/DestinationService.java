package com.tripplanner.LocationService.service.interfaces;

import com.tripplanner.LocationService.entity.Destination;


import java.util.ArrayList;

public interface DestinationService {
    public ArrayList<Destination> searchDestinationByKeyword(String keyword);
}
