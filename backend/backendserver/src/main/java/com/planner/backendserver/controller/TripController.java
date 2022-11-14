package com.planner.backendserver.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.planner.backendserver.DTO.GenerateTripUserInput;
import com.planner.backendserver.DTO.response.TripDTO;
import com.planner.backendserver.DTO.UserDTO;
import com.planner.backendserver.DTO.response.ChecklistItemDTO;
import com.planner.backendserver.DTO.response.DetailedTripDTO;
import com.planner.backendserver.DTO.response.TripDetailDTO;
import com.planner.backendserver.DTO.response.SimpleResponse;
import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.ChecklistItem;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.TripDetails;
import com.planner.backendserver.repository.ChecklistItemRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.repository.TripRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import com.planner.backendserver.service.implementers.AsyncManager;
import com.planner.backendserver.service.interfaces.TripService;
import net.minidev.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.*;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
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
    private AsyncManager asyncManager;
    @Autowired
    private DiscoveryClient discoveryClient;
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
    @PostMapping("/clone-trip")
    public ResponseEntity<TripGeneralDTO> cloneTrip(@RequestBody ObjectNode objectNode){
        try{
            Date startDate = Date.valueOf(objectNode.get("startDate").asText());
            int tripId = objectNode.get("tripId").asInt();
            int userId = objectNode.get("userId").asInt();
            TripGeneralDTO result = tripService.cloneTrip(userId, tripId, startDate);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/edit-name")
    public ResponseEntity<?> updateTripName(@RequestBody ObjectNode request){
        try{
            int tripId = request.get("tripId").asInt();
            String newName = request.get("name").asText();
            if (!tripService.tripExists(tripId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            tripService.editTripName(tripId, newName);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/edit-dates")
    public ResponseEntity<?> updateStartAndEndDates(@RequestBody ObjectNode requestBody){
        try{
            int tripId = requestBody.get("tripId").asInt();
            Date startDate = Date.valueOf(requestBody.get("startDate").asText());
            Date endDate = Date.valueOf(requestBody.get("endDate").asText());
            if (!tripService.tripExists(tripId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            tripService.editStartAndEndDates(tripId, startDate, endDate);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get-distance")
    public ResponseEntity<Double> getDistanceBetweenTwoPOIs(@RequestParam int from, @RequestParam int to){
        try{
            Optional<Double> distance = tripService.getDistanceBetweenTwoPOIs(from, to);
            if (distance.isEmpty()){
                return new ResponseEntity<>(-1.0, HttpStatus.OK);
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
    public ResponseEntity<TripDetailDTO> addTripDetail(@RequestBody ObjectNode objectNode){
        try{
            Date date = Date.valueOf(objectNode.get("date").asText());
            int startTime = objectNode.get("startTime").asInt();
            int endTime = objectNode.get("endTime").asInt();
            int tripId = objectNode.get("tripId").asInt();
            int activityId = objectNode.get("activityId").asInt();
            String note = objectNode.get("note").asText();
            TripDetailDTO result = tripService.addTripDetail(date, startTime, endTime, activityId, tripId, note);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/add-custom-detail")
    public ResponseEntity<TripDetailDTO> addCustomTripDetail(@RequestBody ObjectNode objectNode){
        try{
            Date date = Date.valueOf(objectNode.get("date").asText());
            int startTime = objectNode.get("startTime").asInt();
            int endTime = objectNode.get("endTime").asInt();
            int tripId = objectNode.get("tripId").asInt();
            String name = objectNode.get("name").asText();
            String address = objectNode.get("address").asText();
            TripDetailDTO result = tripService.addCustomTripDetail(date, startTime, endTime, tripId, name, address);
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
    @PostMapping("/get-details-to-delete")
    public ResponseEntity<List<TripDetailDTO>> getDetailsToDelete(@RequestBody ObjectNode objectNode){
        try{
            int tripId = objectNode.get("tripId").asInt();
            int numberOfDays = objectNode.get("numberOfDays").asInt();
            List<TripDetailDTO> tripDetailDTOS= tripService.getTripDetailsToBeDeleted(tripId, numberOfDays);
            return new ResponseEntity<>(tripDetailDTOS, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/put-detail")
    public ResponseEntity<TripDetailDTO> editTripDetail(@RequestBody TripDetailDTO newDetail, @RequestParam int id){
        try{
            TripDetailDTO detail = tripService.editTripDetailById(newDetail,id);
            if (detail==null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/put-custom-detail")
    public ResponseEntity<TripDetailDTO> editCustomTripDetail(@RequestBody TripDetailDTO newDetail, @RequestParam int detailId, @RequestParam int tripId){
        try{
            TripDetailDTO detail = tripService.editCustomTripDetailById(newDetail,detailId,tripId);
            if (detail == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail, HttpStatus.OK);
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
            tripRepo.createEmptyTrip(date, date, "PRIVATE", tripDTO.getBudget(), tripDTO.getName(), tripDTO.getUserId(), tripDTO.getStartDate(), tripDTO.getEndDate());
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
    @PostMapping("/generate")
    public ResponseEntity<SimpleResponse> generateTrip(@RequestBody GenerateTripUserInput input) throws JsonProcessingException {
        List<ServiceInstance> instances = discoveryClient.getInstances("Optimizer");

        ServiceInstance instance =  instances.get(0);

        System.out.println(instance);


        String url = "http://localhost:"+instance.getPort()+"/trip/generate";

        System.out.println(url);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        ObjectMapper mapper = new ObjectMapper();
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd").create();
        String personJsonObject  = gson.toJson(input);
        HttpEntity<String> request =
                new HttpEntity<String>(personJsonObject, headers);
        System.out.println(request);
        String personResultAsJsonStr =
                restTemplate.postForObject(url, request, String.class);

        JsonNode root = mapper.readTree(personResultAsJsonStr);
        System.out.println(root.path("port").asText());
        SimpleResponse target2 = gson.fromJson(personResultAsJsonStr, SimpleResponse.class);
        if(asyncManager.checkExistUser(input.getUserId())){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        asyncManager.putJob(target2.getId(),target2.getUserID());
        asyncManager.putPort(target2.getUserID(),target2.getPort());
        return new ResponseEntity<>(target2,HttpStatus.OK);
    }

    @GetMapping("/checkGenerating/{id}")
    public boolean checkGenerating(@PathVariable int id){
        if(!asyncManager.checkExistUser(id)) {
            return false;
        }
        List<ServiceInstance> instances = discoveryClient.getInstances("Optimizer");

        ServiceInstance instance =  instances.get(0);

        System.out.println(instance);


        String url = "http://localhost:"+asyncManager.getPortByUserId(id)+"/trip/checkUserFree/"+id;

        RestTemplate restTemplate = new RestTemplate();
        String personResultAsJsonStr =
                restTemplate.getForObject(url, String.class);
        Boolean check = Boolean.parseBoolean(personResultAsJsonStr);
        if(!check){
            asyncManager.removeUser(id);
            asyncManager.removeUserPort(id);
        }
        return Boolean.parseBoolean(personResultAsJsonStr);
    }

    @PostMapping("/cancel/{id}")
    public  ResponseEntity<Boolean> cancelJob(@PathVariable int id){
        String url = "http://localhost:"+asyncManager.getPortByUserId(id)+"/trip/cancel/"+asyncManager.getJobByUserId(id)+"/"+id;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> result = restTemplate.postForEntity(url,null,String.class);
        if(result.getStatusCode().is2xxSuccessful()){
            asyncManager.removeUserPort(id);
            asyncManager.removeUser(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/getServiceInfo/{id}")
    public ResponseEntity<SimpleResponse> getServiceInfo(@PathVariable int id){
        if(!asyncManager.checkExistUser(id)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        SimpleResponse response = new SimpleResponse();
        response.setPort(asyncManager.getPortByUserId(id));
        response.setId(asyncManager.getJobByUserId(id));
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
}
