package com.example.Optimizer.controller;


import com.example.Optimizer.DTO.GenerateTripUserInput;
import com.example.Optimizer.DTO.Response.RequestStatus;
import com.example.Optimizer.DTO.Response.SimpleResponse;
import com.example.Optimizer.entity.Trip;
import com.example.Optimizer.repository.POIRepository;
import com.example.Optimizer.service.AsyncJobsManager;
import com.example.Optimizer.service.interfaces.GenerateTrip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/trip")
public class TripController {
    @Autowired
    SimpMessagingTemplate template;
    @Autowired
    POIRepository poiRepository;
    @Autowired
    GenerateTrip generateTrip;
    @Autowired
    protected AsyncJobsManager asyncJobsManager;


    @Autowired
    private Environment environment;
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/generate")
    public ResponseEntity generateTrip(@RequestBody GenerateTripUserInput input) throws ExecutionException, InterruptedException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        System.out.println("----------");
        System.out.println(input.getStartDate());
        System.out.println(input.getEndDate());
        System.out.println(input.getBudget());
        System.out.println(input.getDestinationId());
        System.out.println(input.getUserId());
        CompletableFuture<SimpleResponse> trip = generateTrip.generateTrip(input);
        String uid = UUID.randomUUID().toString();
        String serverPort = environment.getProperty("local.server.port");
        trip.whenComplete((response,e) ->{
            template.convertAndSend("/chatroom","done");

        });

        if(asyncJobsManager.checkExistUser(input.getUserId())){
            return new ResponseEntity<SimpleResponse>(new SimpleResponse(uid,null , RequestStatus.IN_PROGRESS,input.getUserId(),serverPort) , HttpStatus.OK) ;
        }
        asyncJobsManager.putJob(uid,input.getUserId(),trip);
        input.setId(uid);
        template.convertAndSend("/chatroom","abc");
        template.convertAndSendToUser("abc","/chatroom","private");

        return new ResponseEntity<SimpleResponse>(new SimpleResponse(uid,null , RequestStatus.SUBMITTED, input.getUserId(), serverPort) , HttpStatus.OK) ;


    }
    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message){
        return message;
    }
    @GetMapping("/getStatus/{id}")
    public SimpleResponse getJobStatus(@PathVariable String id) throws Throwable {
        return generateTrip.getJobStatus(id);
    }


    @GetMapping("/checkUserFree/{id}")
    public boolean checkUserFree(@PathVariable int id){
        return asyncJobsManager.checkExistUser(id);
    }

    @GetMapping("/getOutput/{id}")
    public Trip getTrip(@PathVariable String id) throws Exception {
        return  generateTrip.getOutput(id);
    }

    @PostMapping ("/cancel/{id}/{uid}")
    public String cancelJob(@PathVariable  String id,@PathVariable int uid) throws Exception {
        if(generateTrip.cancelJob(id,uid)){
            return "Cancelled";
        }
        return "Fail";
    }
}
