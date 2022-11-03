package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.POIofDestinationDTO;
import com.planner.backendserver.DTO.response.RatingDTO;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.interfaces.POIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/api/pois")
public class POIController {
    @Autowired
    private POIRepository poiRepo;

    @Autowired
    private POIService poiService;

    @GetMapping("/{desid}/{page}/{catid}/{rating}")
    public ResponseEntity<ArrayList<POIofDestinationDTO>> getPOIsOfDestinationFilter(@PathVariable("desid") int desid, @PathVariable("page") int page, @PathVariable("catid") int catid, @PathVariable("rating") int rating) {
        try {
            ArrayList<POIofDestinationDTO> pois;
            if (catid == 0)
                pois = poiRepo.getPOIOfDestination(desid, page * 10,
                        10, rating);
            else
                pois = poiRepo.getPOIOfDestinationFilter(desid, catid, page * 10, 10, rating);
            if (pois.isEmpty()) {

                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(pois, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{desid}/{catid}/{rating}/count")
    public ResponseEntity<Integer> getCountPOIsOfDestination(@PathVariable("desid") int desid, @PathVariable("catid") int catid, @PathVariable("rating") int rating) {
        try {

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
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(poi, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{poiId}/ratings")
    public ResponseEntity<ArrayList<RatingDTO>> getPOIRatings(@PathVariable("poiId") int poiId) {
        ArrayList<RatingDTO> rate;
        rate = poiService.getRatingListByPOIId(poiId);
        if (rate.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(rate, HttpStatus.OK);
    }

    @GetMapping("/{poiId}/images")
    public ResponseEntity<ArrayList<String>> getPOIImages(@PathVariable("poiId") int poiId) {
        try {
            ArrayList<String> img;
            img = poiRepo.getImagesByPOIId(poiId);
            if (img.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(img, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/editRating")
    public ResponseEntity<ArrayList<RatingDTO>> updateRating(@RequestBody RatingDTO dto) {
        try {
            int rate = dto.getRate();
            String comment = dto.getComment();
            Date modified = new Date(System.currentTimeMillis());
            int uid = dto.getUserId();
            int poiId = dto.getPoiId();
            poiService.updateRatingInPOI(rate, comment, modified, uid, poiId);
            ArrayList<RatingDTO> list = poiService.getRatingListByPOIId(poiId);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createRating")
    public ResponseEntity<ArrayList<RatingDTO>> createRating(@RequestBody RatingDTO dto) {
        try {
            int rate = dto.getRate();
            String comment = dto.getComment();
            Date created = new Date(System.currentTimeMillis());
            int uid = dto.getUserId();
            int poiId = dto.getPoiId();
            poiService.createRatingInPOI(comment, created, created, rate, poiId, uid);
            ArrayList<RatingDTO> list = poiService.getRatingListByPOIId(poiId);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
