package com.example.Optimizer.controller;


import com.example.Optimizer.DTO.GenerateTripUserInput;
import com.example.Optimizer.DTO.Response.ComplexResponse;
import com.example.Optimizer.DTO.Response.RequestStatus;
import com.example.Optimizer.DTO.Response.SimpleResponse;
import com.example.Optimizer.service.AsyncJobsManager;
import com.example.Optimizer.service.interfaces.GenerateTrip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.transaction.annotation.Transactional;
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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

        generateTrip.generateTrip(input,baseUrl).thenComposeAsync(response -> {
            try {
               return generateTrip.insertToDB(response);
            } catch (ExecutionException e) {
                throw new RuntimeException(e);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        String serverPort = environment.getProperty("local.server.port");





        return new ResponseEntity<SimpleResponse>(new SimpleResponse("1",RequestStatus.IN_PROGRESS, input.getUserId(), "8088"),HttpStatus.OK);


    }

}
