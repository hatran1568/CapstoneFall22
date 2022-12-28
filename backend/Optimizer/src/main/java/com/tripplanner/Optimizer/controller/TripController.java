package com.tripplanner.Optimizer.controller;


import com.tripplanner.Optimizer.DTO.GenerateTripUserInput;
import com.tripplanner.Optimizer.DTO.Response.RequestStatus;
import com.tripplanner.Optimizer.DTO.Response.SimpleResponse;
import com.tripplanner.Optimizer.service.AsyncJobsManager;
import com.tripplanner.Optimizer.service.interfaces.GenerateTrip;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.concurrent.ExecutionException;
@Slf4j
@RestController
@RequestMapping("/optimizer/trip")
public class TripController {


    @Autowired
    protected AsyncJobsManager asyncJobsManager;
    @Autowired
    GenerateTrip generateTrip;
    @Autowired
    private Environment environment;

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/generate")
    public ResponseEntity<?> generateTrip(HttpServletRequest request, @RequestBody GenerateTripUserInput input) throws ExecutionException, InterruptedException, MessagingException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        log.info("----------");
        System.out.println(input.getStartDate());
        System.out.println(input.getEndDate());
        System.out.println(input.getBudget());
        System.out.println(input.getDestinationId());
        System.out.println(input.getUserId());
        String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(null)
                .build()
                .toUriString();
        String bearerToken = request.getHeader("Authorization");
        generateTrip.generateTrip(input, baseUrl, bearerToken).thenComposeAsync(response -> {
            try {
                return generateTrip.insertToDB(response);
            } catch (ExecutionException | InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        String serverPort = environment.getProperty("local.server.port");
        return new ResponseEntity<SimpleResponse>(new SimpleResponse("1", RequestStatus.IN_PROGRESS, input.getUserId(), "8088"), HttpStatus.OK);
    }
}
