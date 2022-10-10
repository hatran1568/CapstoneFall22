package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.DestinationDetailsDTO;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.DestinationImage;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.repository.DestinationRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/Destination")
public class DestinationController {
    @Autowired
    private UserDTOServiceImplementer userDTOService;
    @Autowired
    private DestinationRepository destinationRepo;

    @GetMapping("/{id}")
    public ResponseEntity<DestinationDetailsDTO> getDestinationById(@PathVariable int id){
        try{
            Destination destination = destinationRepo.getDestinationById(id);
            if (destination == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            ArrayList<POI> POIs = destinationRepo.get3FirstPOIofDestination(id);
            ArrayList<String> images = destinationRepo.getDestinationImagesURL(id);
            DestinationDetailsDTO destinationDetailsDTO = new DestinationDetailsDTO();
            destinationDetailsDTO.setDestination(destination);
            destinationDetailsDTO.setImages(images);
            destinationDetailsDTO.setPOIs(POIs);
            return new ResponseEntity<>(destinationDetailsDTO, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
