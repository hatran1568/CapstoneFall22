package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.GalleryImages;
import com.planner.backendserver.DTO.POIBoxDTO;
import com.planner.backendserver.DTO.POIofDestinationDTO;
import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.Rating;
import com.planner.backendserver.repository.DestinationRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/pois")
public class POIController {
    @Autowired
    private POIRepository poiRepo;

//    @GetMapping("/{desid}/{page}")
//    public ResponseEntity<ArrayList<POIofDestinationDTO>> getPOIsOfDestination(@PathVariable("desid") int desid, @PathVariable("page") int page){
//        try{
//            ArrayList<POIofDestinationDTO> pois = poiRepo.getPOIOfDestination(desid, page*10, 10);
//
//            if (pois.isEmpty()){
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            }
//            return new ResponseEntity<>(pois, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }


    @GetMapping("/{desid}/{page}/{catid}/{rating}")
    public ResponseEntity<ArrayList<POIofDestinationDTO>> getPOIsOfDestinationFilter(@PathVariable("desid") int desid, @PathVariable("page") int page, @PathVariable("catid") int catid, @PathVariable("rating") int rating){
        try{
            ArrayList<POIofDestinationDTO> pois;
            if (catid == 0)
                pois = poiRepo.getPOIOfDestination(desid, page*10, 10, rating);
            else
                pois = poiRepo.getPOIOfDestinationFilter(desid, catid, page*10, 10, rating);
            if (pois.isEmpty()){

                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(pois, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //    @GetMapping("/{desid}/count")
//    public ResponseEntity<Integer> getCountPOIsOfDestination(@PathVariable("desid") int desid){
//        try{
//            int count = poiRepo.getCountPOIOfDestination(desid);
//            return new ResponseEntity<>(count, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("/{desid}/{catid}/{rating}/count")
    public ResponseEntity<Integer> getCountPOIsOfDestination(@PathVariable("desid") int desid, @PathVariable("catid") int catid, @PathVariable("rating") int rating){
        try{

            int count;
            if (catid == 0)
                count = poiRepo.getCountPOIOfDestination(desid, rating);
            else
                count = poiRepo.getCountPOIOfDestinationFilter(desid, catid, rating);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{poiId}")
    public ResponseEntity<MasterActivity> getPOIDetails(@PathVariable("poiId") int poiId) {
        try {
            MasterActivity poi;
            poi = poiRepo.getPOIByActivityId(poiId);
            if (poi == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(poi, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{poiId}/ratings")
    public ResponseEntity<ArrayList<Rating>> getPOIRatings(@PathVariable("poiId") int poiId) {
        ArrayList<Rating> rate;
        rate = poiRepo.getRatingsByPOIId(poiId);
        if (rate.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(rate, HttpStatus.OK);
    }

    @GetMapping("/{poiId}/images")
    public ResponseEntity<ArrayList<String>> getPOIImages(@PathVariable("poiId") int poiId) {
        ArrayList<String> img;
        img = poiRepo.getImagesByPOIId(poiId);
        if (img.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(img, HttpStatus.OK);
    }
}
