package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.planner.backendserver.DTO.TripDTO;
import com.planner.backendserver.DTO.UserDTO;
import com.planner.backendserver.DTO.response.DetailedTripDTO;
import com.planner.backendserver.DTO.response.TripDetailDTO;
import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.TripDetails;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.repository.TripRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import com.planner.backendserver.service.interfaces.TripService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.sql.Date;
import java.util.Calendar;
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
    @Autowired
    ModelMapper mapper;

    @GetMapping("/{id}")
    public ResponseEntity<DetailedTripDTO> getTripById(@PathVariable int id){
        try{
            DetailedTripDTO trip = tripService.getDetailedTripById(id);
            if (trip == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/general/{id}")
    public ResponseEntity<TripGeneralDTO> getTripGeneralById(@PathVariable int id){
        try{
            TripGeneralDTO trip = tripService.getTripGeneralById(id);
            if (trip == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(trip, HttpStatus.OK);
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
            int tripId = objectNode.get("tripId").asInt();
            int activityId = objectNode.get("activityId").asInt();
            TripDetails result = tripService.addTripDetail(date, startTime, endTime, activityId, tripId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/add-custom-detail")
    public ResponseEntity<TripDetails> addCustomTripDetail(@RequestBody ObjectNode objectNode){
        try{
            Date date = Date.valueOf(objectNode.get("date").asText());
            int startTime = objectNode.get("startTime").asInt();
            int endTime = objectNode.get("endTime").asInt();
            int tripId = objectNode.get("tripId").asInt();
            String name = objectNode.get("name").asText();
            String address = objectNode.get("address").asText();
            TripDetails result = tripService.addCustomTripDetail(date, startTime, endTime, tripId, name, address);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get-detail")
    public ResponseEntity<TripDetailDTO> getTripDetail(@RequestParam int id){
        try{
            TripDetailDTO detail = tripService.getTripDetailById(id);
            if (detail ==null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/put-detail")
    public ResponseEntity<TripDetails> editTripDetail(@RequestBody TripDetails newDetail, @RequestParam int id){
        try{
            Optional<TripDetails> detail = tripService.editTripDetailById(newDetail,id);
            if (detail.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail.get(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/put-custom-detail")
    public ResponseEntity<TripDetails> editCustomTripDetail(@RequestBody TripDetails newDetail, @RequestParam int id){
        try{
            Optional<TripDetails> detail = tripService.editCustomTripDetailById(newDetail,id);
            if (detail.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail.get(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @GetMapping("/getTripsByUser/{userId}")
    public ResponseEntity<?> getTripsByUser(@PathVariable int userId) {
        try {

            return new ResponseEntity<>(tripService.getTripsByUser(userId), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @RequestMapping(value = "/createTrip", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> createEmptyTrip(@RequestBody TripDTO tripDTO) {
        try{
            java.sql.Date date = new java.sql.Date(Calendar.getInstance().getTime().getTime());
            tripRepo.createEmptyTrip(date, date, false, tripDTO.getBudget(), tripDTO.getName(), tripDTO.getUserId(), tripDTO.getStartDate(), tripDTO.getEndDate());
            return new ResponseEntity<>(tripRepo.getNewestTripId(), HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping("/delete-trip")
    public ResponseEntity<?> deleteTrip(@RequestBody ObjectNode objectNode){
        try{
            int id = objectNode.get("id").asInt();
            tripService.deleteTripById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-trip-3/{userId}")
    public ResponseEntity<?> getTripsForHomepage(@PathVariable int userId){
        try{
            return new ResponseEntity<>(tripService.getLast3TripsByUser(userId), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-total-trip/{userId}")
    public ResponseEntity<?> getTotalTrips(@PathVariable int userId){
        try{
            return new ResponseEntity<>(tripService.countTripByUser(userId), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
