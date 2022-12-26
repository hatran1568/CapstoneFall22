package com.tripplanner.TripService.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tripplanner.TripService.dto.request.GenerateTripUserInput;
import com.tripplanner.TripService.dto.response.SimpleResponse;
import com.tripplanner.TripService.repository.TripRepository;
import com.tripplanner.TripService.service.interfaces.TripService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/trip/optimize")
public class OptimizeController {

    @Autowired
    private TripService tripService;

    @Autowired
    private TripRepository tripRepo;

    @Autowired
    private DiscoveryClient discoveryClient;

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/generate")
    public ResponseEntity<SimpleResponse> generateTrip(@RequestBody GenerateTripUserInput input) throws JsonProcessingException {
        log.info("-----------\n----------\n----------\n----------\n----------\n----------\n----------\n----------\n----------\n----------\n----------");
        log.info(String.valueOf(System.currentTimeMillis() / 1000));
        List<ServiceInstance> instances = discoveryClient.getInstances("Optimizer");

        ServiceInstance instance = instances.get(0);

        System.out.println(instance);

        log.info(instance.getUri() + "/optimize/trip/generate");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        ObjectMapper mapper = new ObjectMapper();
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd").create();
        String personJsonObject = gson.toJson(input);

        HttpEntity<String> request =
                new HttpEntity<String>(personJsonObject, headers);
        System.out.println(request);

        String personResultAsJsonStr =
                restTemplate.postForObject(instance.getUri() + "/optimizer/trip/generate", request, String.class);
        JsonNode root = mapper.readTree(personResultAsJsonStr);

        System.out.println(root.path("port").asText());

        SimpleResponse target2 = gson.fromJson(personResultAsJsonStr, SimpleResponse.class);
        if(tripRepo.getStatusGenerating(input.getUserId())!=null ){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(target2, HttpStatus.OK);
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/checkGenerating/{id}")
    public boolean checkGenerating(@PathVariable int id) {
        return tripRepo.getStatusGenerating(id) != null;
    }
}
