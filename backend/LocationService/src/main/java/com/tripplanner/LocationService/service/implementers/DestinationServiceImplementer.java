package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.dto.response.DestinationGeneralDTO;
import com.tripplanner.LocationService.entity.Destination;
import com.tripplanner.LocationService.repository.DestinationRepository;
import com.tripplanner.LocationService.service.interfaces.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DestinationServiceImplementer implements DestinationService {
    @Autowired
    DestinationRepository destinationRepository;

    @Override
    public ArrayList<Destination> searchDestinationByKeyword(String keyword) {
        return destinationRepository.getDestinationsByKeyword(keyword);
    }
    public List<DestinationGeneralDTO> get3Destinations(){
        ArrayList<Destination> destinations = destinationRepository.get3Destinations();
        List<DestinationGeneralDTO> destinationGeneralDTOS = destinations.stream().map(destination -> {
            DestinationGeneralDTO dto = new DestinationGeneralDTO();
            dto.setDestinationId(destination.getDestinationId());
            dto.setName(destination.getName());
            dto.setDescription(destination.getDescription());
            Optional<String> thumbnail = destinationRepository.getThumbnailById(destination.getDestinationId());
            dto.setThumbnail(thumbnail.isPresent()?thumbnail.get():null);
            return dto;
        }).collect(Collectors.toList());
        return destinationGeneralDTOS;
    }
}
