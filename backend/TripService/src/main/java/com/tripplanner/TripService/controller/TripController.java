package com.tripplanner.TripService.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tripplanner.TripService.dto.request.TripGenerateDTO;
import com.tripplanner.TripService.dto.response.DetailedTripDTO;
import com.tripplanner.TripService.dto.response.TripDTO;
import com.tripplanner.TripService.dto.response.TripDetailDTO;
import com.tripplanner.TripService.dto.response.TripGeneralDTO;
import com.tripplanner.TripService.entity.TripDetails;
import com.tripplanner.TripService.entity.TripStatus;
import com.tripplanner.TripService.repository.TripRepository;
import com.tripplanner.TripService.service.interfaces.TripService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/trip")
public class TripController {
    @Autowired
    private TripService tripService;

    @Autowired
    private TripRepository tripRepo;

    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/{id}")
    public ResponseEntity<DetailedTripDTO> getTripById(@PathVariable int id, @RequestParam(required = false) Integer userId) {
        try {
            if (userId == null) userId = -1;
            DetailedTripDTO trip = tripService.getDetailedTripById(id, userId);
            if (trip == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/general/{id}")
    public ResponseEntity<TripGeneralDTO> getTripGeneralById(@PathVariable int id) {
        try {
            TripGeneralDTO trip = tripService.getTripGeneralById(id);
            if (trip == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/clone-trip")
    public ResponseEntity<TripGeneralDTO> cloneTrip(@RequestBody ObjectNode objectNode) {
//        try{
        Date startDate = Date.valueOf(objectNode.get("startDate").asText());
        int tripId = objectNode.get("tripId").asInt();
        int userId = objectNode.get("userId").asInt();
        TripGeneralDTO result = tripService.cloneTrip(userId, tripId, startDate);
        return new ResponseEntity<>(result, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/edit-name")
    public ResponseEntity<?> updateTripName(@RequestBody ObjectNode request) {
        try {
            int tripId = request.get("tripId").asInt();
            String newName = request.get("name").asText();
            if (!tripService.tripExists(tripId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            tripService.editTripName(tripId, newName);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/edit-dates")
    public ResponseEntity<?> updateStartAndEndDates(@RequestBody ObjectNode requestBody) {
        try {
            int tripId = requestBody.get("tripId").asInt();
            Date startDate = Date.valueOf(requestBody.get("startDate").asText());
            Date endDate = Date.valueOf(requestBody.get("endDate").asText());
            if (!tripService.tripExists(tripId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            tripService.editStartAndEndDates(tripId, startDate, endDate);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})

    @GetMapping("/get-distance")
    public ResponseEntity<Double> getDistanceBetweenTwoPOIs(@RequestParam int from, @RequestParam int to) {
//        try{
        Optional<Double> distance = tripService.getDistanceBetweenTwoPOIs(from, to);
        if (distance.isEmpty()) {
            return new ResponseEntity<>(-1.0, HttpStatus.OK);
        }
        return new ResponseEntity<>(distance.get(), HttpStatus.OK);
//    } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    //    @GetMapping("/master-activity/{id}")
//    public ResponseEntity<MasterActivity> getMasterActivityById(@PathVariable int id){
//        try{
//            MasterActivity ma = poiRepository.getPOIByActivityId(id);
//
//            return new ResponseEntity<>(ma, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/add-detail")
    public ResponseEntity<TripDetailDTO> addTripDetail(@RequestBody ObjectNode objectNode) {
//        try{
        String dateString = objectNode.get("date").asText();
        Date date = Date.valueOf(objectNode.get("date").asText());
        int startTime = objectNode.get("startTime").asInt();
        int endTime = objectNode.get("endTime").asInt();
        int tripId = objectNode.get("tripId").asInt();
        int activityId = objectNode.get("activityId").asInt();
        String note = objectNode.get("note").asText();
        TripDetailDTO result = tripService.addTripDetail(date, startTime, endTime, activityId, tripId, note);
        return new ResponseEntity<>(result, HttpStatus.OK);
//        } catch (Exception e){
//            log.info(e.getMessage());
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/add-detail-generated")
    public ResponseEntity<Integer> addTripDetailGenerated(@RequestBody ObjectNode objectNode) {
//        try{
        int date = objectNode.get("date").asInt();
        int startTime = objectNode.get("startTime").asInt();
        int endTime = objectNode.get("endTime").asInt();
        int tripId = objectNode.get("tripId").asInt();
        int activityId = objectNode.get("activityId").asInt();
        String note = objectNode.get("note").asText();
        Integer result = tripService.addTripDetailGenerated(date, startTime, endTime, activityId, tripId, note);
        return new ResponseEntity<>(result, HttpStatus.OK);
//        } catch (Exception e){
//            log.info(e.getMessage());
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})

    @PostMapping("/add-custom-detail")
    public ResponseEntity<TripDetailDTO> addCustomTripDetail(@RequestBody ObjectNode objectNode) {
//        try{
        Date date = Date.valueOf(objectNode.get("date").asText());
        int startTime = objectNode.get("startTime").asInt();
        int endTime = objectNode.get("endTime").asInt();
        int tripId = objectNode.get("tripId").asInt();
        String name = objectNode.get("name").asText();
        String address = objectNode.get("address").asText();
        String note = objectNode.get("note").asText();
        TripDetailDTO result = tripService.addCustomTripDetail(date, startTime, endTime, tripId, name, address, note);
        return new ResponseEntity<>(result, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/get-detail")
    public ResponseEntity<TripDetailDTO> getTripDetail(@RequestParam int id) {
        try {
            TripDetailDTO detail = tripService.getTripDetailById(id);
            if (detail == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/get-details-to-delete")
    public ResponseEntity<List<TripDetailDTO>> getDetailsToDelete(@RequestBody ObjectNode objectNode) {
//        try{
        int tripId = objectNode.get("tripId").asInt();
        int numberOfDays = objectNode.get("numberOfDays").asInt();
        List<TripDetailDTO> tripDetailDTOS = tripService.getTripDetailsToBeDeleted(tripId, numberOfDays);
        return new ResponseEntity<>(tripDetailDTOS, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PutMapping("/put-detail")
    public ResponseEntity<TripDetailDTO> editTripDetail(@RequestBody TripDetailDTO newDetail, @RequestParam int id) {
        try {
            TripDetailDTO detail = tripService.editTripDetailById(newDetail, id);
            if (detail == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(detail, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PutMapping("/put-custom-detail")
    public ResponseEntity<TripDetailDTO> editCustomTripDetail(@RequestBody TripDetailDTO newDetail, @RequestParam int detailId, @RequestParam int tripId) {
//        try{
        TripDetailDTO detail = tripService.editCustomTripDetailById(newDetail, detailId, tripId);
        if (detail == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(detail, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @DeleteMapping("/delete-detail")
    public ResponseEntity<TripDetails> deleteTripDetail(@RequestBody ObjectNode objectNode) {
        try {
            int id = objectNode.get("id").asInt();
            tripService.deleteDetailById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/getTripsByUser/{userId}")
    public ResponseEntity<?> getTripsByUser(@PathVariable int userId) {
//        try {

            return new ResponseEntity<>(tripService.getTripsByUser(userId), HttpStatus.OK);

//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @RequestMapping(value = "/createTrip", consumes = "application/json", produces = {"*/*"}, method = RequestMethod.POST)
    public ResponseEntity<?> createEmptyTrip(@RequestBody TripDTO tripDTO) {
//        try{
        TripGeneralDTO result = tripService.createEmptyTrip(tripDTO.getBudget(), tripDTO.getName(), tripDTO.getUserId(), tripDTO.getStartDate(), tripDTO.getEndDate());
        return new ResponseEntity<>(result, HttpStatus.OK);
//        }
//        catch (Exception e){
//            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }

    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @DeleteMapping("/delete-trip")
    public ResponseEntity<?> deleteTrip(@RequestBody ObjectNode objectNode) {
        try {
            int id = objectNode.get("id").asInt();
            tripService.deleteTripById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/get-trip-3/{userId}")
    public ResponseEntity<?> getTripsForHomepage(@PathVariable int userId) {
//        try{
        return new ResponseEntity<>(tripService.getLast3TripsByUser(userId), HttpStatus.OK);
//        } catch(Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/get-total-trip/{userId}")
    public ResponseEntity<?> getTotalTrips(@PathVariable int userId) {
        try {
            return new ResponseEntity<>(tripService.countTripByUser(userId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/insert")
    public ResponseEntity<Integer> insertTrip(@RequestBody TripGenerateDTO input) {

        tripRepo.createEmptyTrip(new Date(Calendar.getInstance().getTime().getTime()), new Date(Calendar.getInstance().getTime().getTime()), TripStatus.PRIVATE.name(), input.getBudget(), input.getName(), input.getUserId(), input.getStartDate(), input.getEndDate());

        return new ResponseEntity<>(tripRepo.getNewestTripId(), HttpStatus.OK);
    }


//    @PostMapping("/generate")
//    public ResponseEntity<SimpleResponse> generateTrip(@RequestBody GenerateTripUserInput input) throws JsonProcessingException {
//        List<ServiceInstance> instances = discoveryClient.getInstances("Optimizer");
//
//        ServiceInstance instance =  instances.get(0);
//
//        System.out.println(instance);
//
//
//        String url = "http://localhost:"+instance.getPort()+"/trip/generate";
//
//        System.out.println(url);
//
//        RestTemplate restTemplate = new RestTemplate();
//        HttpHeaders headers = new HttpHeaders();
//
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        ObjectMapper mapper = new ObjectMapper();
//        Gson gson = new GsonBuilder()
//                .setDateFormat("yyyy-MM-dd").create();
//        String personJsonObject  = gson.toJson(input);
//        HttpEntity<String> request =
//                new HttpEntity<String>(personJsonObject, headers);
//        System.out.println(request);
//        String personResultAsJsonStr =
//                restTemplate.postForObject(url, request, String.class);
//
//        JsonNode root = mapper.readTree(personResultAsJsonStr);
//        System.out.println(root.path("port").asText());
//        SimpleResponse target2 = gson.fromJson(personResultAsJsonStr, SimpleResponse.class);
//        if(asyncManager.checkExistUser(input.getUserId())){
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//        asyncManager.putJob(target2.getId(),target2.getUserID());
//        asyncManager.putPort(target2.getUserID(),target2.getPort());
//        return new ResponseEntity<>(target2,HttpStatus.OK);
//    }

//    @GetMapping("/checkGenerating/{id}")
//    public boolean checkGenerating(@PathVariable int id){
//        if(!asyncManager.checkExistUser(id)) {
//            return false;
//        }
//        List<ServiceInstance> instances = discoveryClient.getInstances("Optimizer");
//
//        ServiceInstance instance =  instances.get(0);
//
//        System.out.println(instance);
//
//
//        String url = "http://localhost:"+asyncManager.getPortByUserId(id)+"/trip/checkUserFree/"+id;
//
//        RestTemplate restTemplate = new RestTemplate();
//        String personResultAsJsonStr =
//                restTemplate.getForObject(url, String.class);
//        Boolean check = Boolean.parseBoolean(personResultAsJsonStr);
//        if(!check){
//            asyncManager.removeUser(id);
//            asyncManager.removeUserPort(id);
//        }
//        return Boolean.parseBoolean(personResultAsJsonStr);
//    }
//
//    @PostMapping("/cancel/{id}")
//    public  ResponseEntity<Boolean> cancelJob(@PathVariable int id){
//        String url = "http://localhost:"+asyncManager.getPortByUserId(id)+"/trip/cancel/"+asyncManager.getJobByUserId(id)+"/"+id;
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<String> result = restTemplate.postForEntity(url,null,String.class);
//        if(result.getStatusCode().is2xxSuccessful()){
//            asyncManager.removeUserPort(id);
//            asyncManager.removeUser(id);
//            return new ResponseEntity<>(HttpStatus.OK);
//        }
//        else{
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//    }

//    @GetMapping("/getServiceInfo/{id}")
//    public ResponseEntity<SimpleResponse> getServiceInfo(@PathVariable int id){
//        if(!asyncManager.checkExistUser(id)){
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//        SimpleResponse response = new SimpleResponse();
//        response.setPort(asyncManager.getPortByUserId(id));
//        response.setId(asyncManager.getJobByUserId(id));
//        return  new ResponseEntity<>(response,HttpStatus.OK);
//    }

    @GetMapping("/get-public-trips")
    public ResponseEntity<?> getPublicTrips(@RequestParam(required = false) Integer page, @RequestParam(required = false) String search, @RequestParam(required = false) Integer minDays, @RequestParam(required = false) Integer maxDays) {
        try {
            if (page == null) page = 0;
            if (search == null) search = "";
            if (minDays == null) minDays = 1;
            if (maxDays == null) maxDays = 0;
            int pageSize = 12;
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MONTH, -1);
            Date earliest = new Date(cal.getTime().getTime());
            return new ResponseEntity<>(tripService.getPublicTrips(page, pageSize, search, minDays, maxDays, earliest), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-public-trips/count")
    public ResponseEntity<?> getPublicTripsCount(@RequestParam(required = false) String search, @RequestParam(required = false) Integer minDays, @RequestParam(required = false) Integer maxDays) {
        try {
            if (search == null) search = "";
            if (minDays == null) minDays = 1;
            if (maxDays == null) maxDays = 0;

            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MONTH, -1);
            Date earliest = new Date(cal.getTime().getTime());
            int count = tripService.countPublicTrips(search, minDays, maxDays, earliest);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/toggle-status")
    public ResponseEntity<?> toggleTripStatus(@RequestBody ObjectNode request) {
//        try{
        int tripId = request.get("tripId").asInt();
        String status = request.get("status").asText();
//            if(status.trim().toUpperCase() != "PUBLIC" && status.trim().toUpperCase() != "PRIVATE")
//                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (!tripService.tripExists(tripId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        tripService.toggleStatus(tripId, status);
        return new ResponseEntity<>(HttpStatus.OK);

//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/get-trip-3-guest")
    public ResponseEntity<?> getTripsForHomepageGuest(@RequestBody int[] array) {
//        try{
        return new ResponseEntity<>(tripService.getLast3TripsByGuest(array), HttpStatus.OK);
//        } catch(Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }
}
