package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.GenerateTripUserInput;
import com.planner.backendserver.entity.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.planner.backendserver.repository.TripRepository;

import java.util.Optional;

@RestController
@RequestMapping("/trip")
public class TripController {
    @Autowired
    private TripRepository tripRepo;

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable int id){
        try{
            Optional<Trip> trip = tripRepo.findById(id);
            if (trip.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(trip.get(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
