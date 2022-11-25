package com.example.Optimizer.controller;


import com.example.Optimizer.DTO.GenerateTripUserInput;
import com.example.Optimizer.DTO.Response.RequestStatus;
import com.example.Optimizer.DTO.Response.SimpleResponse;
import com.example.Optimizer.service.AsyncJobsManager;
import com.example.Optimizer.service.interfaces.GenerateTrip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/optimizer/trip")
public class TripController {


    @Autowired
    GenerateTrip generateTrip;
    @Autowired
    protected AsyncJobsManager asyncJobsManager;


    @Autowired
    private Environment environment;
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/generate")
    public ResponseEntity generateTrip(HttpServletRequest request, @RequestBody GenerateTripUserInput input) throws ExecutionException, InterruptedException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        System.out.println("----------");
        System.out.println(input.getStartDate());
        System.out.println(input.getEndDate());
        System.out.println(input.getBudget());
        System.out.println(input.getDestinationId());
        System.out.println(input.getUserId());
        String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(null)
                .build()
                .toUriString();
        CompletableFuture<SimpleResponse> trip = generateTrip.generateTrip(input,baseUrl);

        String serverPort = environment.getProperty("local.server.port");





        return new ResponseEntity<SimpleResponse>(trip.get(),HttpStatus.OK) ;


    }

}
