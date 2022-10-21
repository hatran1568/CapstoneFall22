package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.service.interfaces.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/search")
public class SearchPOIController {
/*    @Autowired
    SearchService searchService;
    @GetMapping("/poi/{keyword}")
    public ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>> searchPOIByKeyword(@PathVariable String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> results = searchService.searchPOIByKeyword(keyword);
        return new ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>>(results, HttpStatus.OK);
    }*/
}
