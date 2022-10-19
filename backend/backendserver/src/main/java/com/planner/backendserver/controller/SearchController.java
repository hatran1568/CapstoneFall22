package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.service.interfaces.DestinationService;
import com.planner.backendserver.service.interfaces.SearchService;
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
@RequestMapping("/search")
public class SearchController {
    @Autowired
    DestinationService destinationService;
    @Autowired
    SearchService searchService;
    @GetMapping("/both/{keyword}")
    public ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>> searchPOIAndDestinationByKeyword(@PathVariable String keyword){
        ArrayList<SearchPOIAndDestinationDTO> results = searchService.searchPOIAndDestinationByKeyword(keyword);
        return new ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>>(results, HttpStatus.OK);
//        try{
//            ArrayList<SearchPOIAndDestinationDTO> results = searchService.searchPOIAndDestinationByKeyword(keyword);
//            if (results.isEmpty()){
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            }
//            return new ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>>(results, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }
}
