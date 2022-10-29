package com.example.Optimizer.service;

import com.example.Optimizer.DTO.Data;
import com.example.Optimizer.DTO.GenerateTripUserInput;
import com.example.Optimizer.DTO.Response.RequestStatus;
import com.example.Optimizer.DTO.Response.SimpleResponse;
import com.example.Optimizer.DTO.Solution;
import com.example.Optimizer.algorithms.GeneticAlgorithmImplementer;
import com.example.Optimizer.entity.POI;
import com.example.Optimizer.entity.Trip;
import com.example.Optimizer.entity.TripDetails;
import com.example.Optimizer.entity.User;
import com.example.Optimizer.repository.*;
import com.example.Optimizer.service.interfaces.GenerateTrip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class GenerateTripIml implements GenerateTrip{
    @Autowired
    SimpMessagingTemplate template;
    @Autowired
    DistanceRepository distanceRepository;
    @Autowired
    POIRepository poiRepository;
    @Autowired
    TripRepository tripRepository;
    @Autowired
    TripDetailRepository tripDetailRepository;
    @Autowired
    DestinationRepository destinationRepository;

    @Autowired
    AsyncJobsManager asyncJobsManager;

    @Autowired
    private Environment environment;
    @Override
    @Async("asyncTaskExecutor")
    public CompletableFuture<SimpleResponse> generateTrip(GenerateTripUserInput input) {
        CompletableFuture<SimpleResponse> task = new CompletableFuture<>();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        //java.util.Date parsed = format.parse(input.getStartDate());
        Date sDate =input.getStartDate();
        //parsed = format.parse(tripGenerateDTO.getEndDate());
        Date eDate = input.getEndDate();

        ArrayList<POI> listPoi = (ArrayList<POI>) poiRepository.getPOIsByDestinationId(input.getDestinationId());
        int numberOfPOI = listPoi.size();
        POI[] POIs = new POI[numberOfPOI];
        for (int i = 0; i < listPoi.size(); i++) {
            POIs[i] = listPoi.get(i);
        }

        double[][] distanceOfPOI = new double[numberOfPOI][numberOfPOI];
        for(int i=0;i<numberOfPOI;i++){
            for(int j=0;j<numberOfPOI;j++){
                if(i==j)
                    distanceOfPOI[i][j]=0;
                else{
                    distanceOfPOI[i][j]=distanceRepository.getDistanceBySrcAndDest(POIs[i].getActivityId(),POIs[j].getActivityId());
                }
            }
        }
        Data data = new Data(sDate, eDate, distanceOfPOI, POIs, numberOfPOI,input.getUserPreference(),input.getBudget(),input.getStartTime(),input.getEndTime(),input.getUserId());
        GeneticAlgorithmImplementer ga = new GeneticAlgorithmImplementer(data,template);
        Solution s = ga.implementGA(data);

        Trip tour = s.toTrip(data);
        Trip add = new Trip();
        add.setBudget(input.getBudget());
        add.setName(data.getDayOfTrip() + " days in " +destinationRepository.findByDestinationId(input.getDestinationId()).getName());
        add.setStartDate(sDate);
        add.setEndDate(eDate);
        add.setDeleted(false);
        User u = new User();
        u.setUserID(input.getUserId());
       add.setUser(u);
        int tourId = tripRepository.save(add).getTripId();
        tour.setTripId(tourId);
        for (TripDetails poi: tour.getListTripDetails()
             ) {
            poi.setTrip(tour);
            tripDetailRepository.save(poi);
        }
        String serverPort = environment.getProperty("local.server.port");
        task.complete(new SimpleResponse(input.getId(),tour,RequestStatus.COMPLETE,serverPort));
        return  task;
    }
    @Override
    public SimpleResponse getJobStatus(String jobId) throws Throwable {
        CompletableFuture<SimpleResponse> completableFuture = fetchJobElseThrowException(jobId);
        String serverPort = environment.getProperty("local.server.port");
        if (!completableFuture.isDone()) {
            return new SimpleResponse(jobId,new Trip(), RequestStatus.IN_PROGRESS,serverPort);
        }

        Throwable[] errors = new Throwable[1];
        SimpleResponse[] simpleResponses = new SimpleResponse[1];
        completableFuture.whenComplete((response, ex) -> {

            if (ex != null) {
                errors[0] = ex.getCause();
            } else {
                try {
                    response.setTrip(completableFuture.get().getTrip());
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (ExecutionException e) {
                    throw new RuntimeException(e);
                }
                simpleResponses[0] = response;
            }
        });

        if (errors[0] != null) {
            throw errors[0];
        }

        return simpleResponses[0];
    }

    @Override
    public CompletableFuture<SimpleResponse> fetchJob(String jobId) {
        @SuppressWarnings("unchecked")
        CompletableFuture<SimpleResponse> completableFuture = (CompletableFuture<SimpleResponse>) asyncJobsManager.getJob(jobId);
        int a =10;
        return completableFuture;
    }

    @Override
    public CompletableFuture<SimpleResponse> fetchJobElseThrowException(String jobId) throws Exception {
        CompletableFuture<SimpleResponse> job = fetchJob(jobId);
        if(null == job) {

        }
        return job;
    }
    @Override
    public Trip getOutput(String jobId) throws Exception {
        CompletableFuture<SimpleResponse> completableFuture = fetchJob(jobId);

        if (!completableFuture.isDone()) {
            throw new Exception("Job is still in progress...");
        }

        return completableFuture.get().getTrip();
    }
}
