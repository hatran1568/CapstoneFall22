package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.request.GalleryImages;
import com.planner.backendserver.DTO.request.POIBoxDTO;
import com.planner.backendserver.entity.Destination;
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

@RestController
@RequestMapping("/api")
public class DestinationController {
    @Autowired
    private UserDTOServiceImplementer userDTOService;
    @Autowired
    private DestinationRepository destinationRepo;

    @GetMapping("/destination/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable int id){
        try{
            Destination destination = destinationRepo.getDestinationById(id);
            if (destination == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(destination, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/destination/first3POIs/{id}")
    public ResponseEntity<ArrayList<POIBoxDTO>> get3POIinDestination(@PathVariable int id){
        try{
            ArrayList<POIBoxDTO> POIs = destinationRepo.get3FirstPOIofDestination(id);
            if (POIs.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(POIs, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/destination/images/{id}")
    public ResponseEntity<ArrayList<GalleryImages>> getDestinationImages(@PathVariable int id){
        try{
            ArrayList<GalleryImages> images = destinationRepo.getDestinationImagesURL(id);
            if (images.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(images, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
