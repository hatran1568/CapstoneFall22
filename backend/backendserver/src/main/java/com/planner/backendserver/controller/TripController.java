package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.planner.backendserver.DTO.UserDTO;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import com.planner.backendserver.service.interfaces.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.planner.backendserver.repository.TripRepository;

import javax.annotation.security.RolesAllowed;
import java.sql.Date;
import java.util.Optional;

@RestController
@RequestMapping("/trip")
public class TripController {
    @Autowired
    private UserDTOServiceImplementer userDTOService;
    @Autowired
    private TripService tripService;
    @Autowired
    private POIRepository poiRepository;
    @Autowired
    private TripRepository tripRepo;


    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable int id){
        try{
            Optional<Trip> trip = tripService.getTripById(id);
            if (trip.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(trip.get(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get-distance")
    public ResponseEntity<Double> getDistanceBetweenTwoPOIs(@RequestParam int from, @RequestParam int to){
        try{
            Optional<Double> distance = tripService.getDistanceBetweenTwoPOIs(from, to);
            if (distance.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(distance.get(), HttpStatus.OK);
    } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/master-activity/{id}")
    public ResponseEntity<MasterActivity> getMasterActivityById(@PathVariable int id){
        try{
            MasterActivity ma = poiRepository.getPOIByActivityId(id);

            return new ResponseEntity<>(ma, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/add-detail")
    public ResponseEntity<TripDetails> addTripDetail(@RequestBody ObjectNode objectNode){
        try{
            Date date = Date.valueOf(objectNode.get("date").asText());
            int startTime = objectNode.get("startTime").asInt();
            int endTime = objectNode.get("endTime").asInt();
            int activityId = objectNode.get("activityId").asInt();
            int tripId = objectNode.get("tripId").asInt();
            TripDetails result = tripService.addTripDetail(date, startTime, endTime, activityId, tripId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get-detail")
    public ResponseEntity<TripDetails> getTripDetail(@RequestParam int id){
        try{
            Optional<TripDetails> detail = tripService.getTripDetailById(id);
            if (detail.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail.get(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/put-detail")
    public ResponseEntity<TripDetails> getTripDetail(@RequestBody TripDetails newDetail, @RequestParam int id){
//        try{
            Optional<TripDetails> detail = tripService.editTripDetailById(newDetail,id);
            if (detail.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail.get(), HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }
    @DeleteMapping("/delete-detail")
    public ResponseEntity<TripDetails> deleteTripDetail(@RequestBody ObjectNode objectNode){
        try{
            int id = objectNode.get("id").asInt();
            tripService.deleteDetailById(id);
            return new ResponseEntity<>(HttpStatus.OK);
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

//    @PostMapping(
//            value = "/createTrip", consumes = "application/json", produces = "application/json")
//    public Trip createEmptyTrip(@RequestBody EmptyTripDTO trip) {
//        return tripRepo.createEmptyTrip(null, trip.getBudget(), trip.getName(), 1, trip.getStartDate(), trip.getEndDate());
//    }
    @RequestMapping(value = "/createTrip", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity createEmptyTrip(@RequestBody Trip trip) {
        System.out.println(trip);
        try{
            tripRepo.createEmptyTrip(null, trip.getBudget(), trip.getName(), 1, trip.getStartDate(), trip.getEndDate());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
