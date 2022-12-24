package com.tripplanner.LocationService.service.interfaces;

import com.tripplanner.LocationService.dto.response.DestinationGeneralDTO;
import com.tripplanner.LocationService.entity.Destination;


import java.util.ArrayList;
import java.util.List;

public interface DestinationService {
    public ArrayList<Destination> searchDestinationByKeyword(String keyword);
    List<DestinationGeneralDTO> get3Destinations();
}
