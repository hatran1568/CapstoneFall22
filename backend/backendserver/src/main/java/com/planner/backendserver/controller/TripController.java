package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.GenerateTripUserInput;
import com.planner.backendserver.DTO.UserDTO;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.planner.backendserver.repository.TripRepository;

import javax.annotation.security.RolesAllowed;
import java.util.Optional;

@RestController
@RequestMapping("/trip")
public class TripController {
    @Autowired
    private UserDTOServiceImplementer userDTOService;
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

    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value="/test/{id}", method = RequestMethod.GET)

    public ResponseEntity<UserDTO> test(@PathVariable int id){
        try{
            UserDTO userDetails = userDTOService.loadUserById(id);

            return new ResponseEntity(userDetails,HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/test1/{id}")
    public UserDTO getUser(@PathVariable int id){

        UserDTO userDetails = userDTOService.loadUserById(id);
        return  userDetails;
    }




}