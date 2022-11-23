package com.example.Optimizer.service;

import com.example.Optimizer.DTO.*;
import com.example.Optimizer.DTO.Response.DesDetailsDTO;
import com.example.Optimizer.DTO.Response.RequestStatus;
import com.example.Optimizer.DTO.Response.SimpleResponse;
import com.example.Optimizer.DTO.request.ExpenseDTO;
import com.example.Optimizer.DTO.request.TripDetailsGenerateDTO;
import com.example.Optimizer.DTO.request.TripGenerateDTO;
import com.example.Optimizer.algorithms.GeneticAlgorithmImplementer;
import com.example.Optimizer.config.RestTemplateClient;
import com.example.Optimizer.entity.*;
import com.example.Optimizer.repository.*;
import com.example.Optimizer.service.interfaces.GenerateTrip;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;

import lombok.extern.slf4j.Slf4j;

import javax.transaction.Transactional;

@Slf4j
@Service
public class GenerateTripIml implements GenerateTrip {

    @Autowired
    RestTemplateClient restTemplateClient;

    @Autowired
    AsyncJobsManager asyncJobsManager;

    @Autowired
    private Environment environment;

    @Autowired
    private DiscoveryClient discoveryClient;

    @Autowired
    RequestRepository repository;

    @Override
    @Async("asyncTaskExecutor")
    public CompletableFuture<SimpleResponse> generateTrip(GenerateTripUserInput input, String baseUrl) throws ExecutionException, InterruptedException {
        CompletableFuture<SimpleResponse> task = new CompletableFuture<>();
        CompletableFuture<Trip> realTask = new CompletableFuture<>();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        //java.util.Date parsed = format.parse(input.getStartDate());
        Date sDate = input.getStartDate();
        //parsed = format.parse(tripGenerateDTO.getEndDate());
        Date eDate = input.getEndDate();
        List<ServiceInstance> instances = discoveryClient.getInstances("Location_Service");

        ServiceInstance instance = instances.get(0);

        ArrayList<POI> listPoi = (ArrayList<POI>) restTemplateClient.restTemplate().getForObject(instance.getUri() + "/api/pois/poisByDestination/" + input.getDestinationId(), List.class);

        int numberOfPOI = listPoi.size();
        POI[] POIs = new POI[numberOfPOI];
        for (int i = 0; i < listPoi.size(); i++) {
            POIs[i] = listPoi.get(i);
        }

        double[][] distanceOfPOI = new double[numberOfPOI][numberOfPOI];
        for (int i = 0; i < numberOfPOI; i++) {
            for (int j = 0; j < numberOfPOI; j++) {
                if (i == j)
                    distanceOfPOI[i][j] = 0;
                else {
                    distanceOfPOI[i][j] = restTemplateClient.restTemplate().getForObject(instance.getUri() + "/api/pois/distance/" + POIs[i].getActivityId() + "/" + POIs[j].getActivityId(), Double.class);

                }
            }
        }
        String serverPort = environment.getProperty("local.server.port");
        Data data = new Data(sDate, eDate, distanceOfPOI, POIs, numberOfPOI, input.getUserPreference(), input.getBudget(), input.getStartTime(), input.getEndTime(), input.getUserId());
        GeneticAlgorithmImplementer ga = new GeneticAlgorithmImplementer(data);
        Solution s = ga.implementGA(data);


        task.complete(new SimpleResponse(input.getId(), RequestStatus.COMPLETE, input.getUserId(), baseUrl));
        repository.insert(RequestStatus.IN_PROGRESS.name(), baseUrl, input.getUserId());
        task.whenComplete(new BiConsumer<SimpleResponse, Throwable>() {
            @Override

            public void accept(SimpleResponse simpleResponse, Throwable throwable) {

                    List<ServiceInstance> instances = discoveryClient.getInstances("Trip_Service");

                    ServiceInstance instance = instances.get(0);
                    HttpHeaders headers = new HttpHeaders();

                    headers.setContentType(MediaType.APPLICATION_JSON);
                    ObjectMapper mapper = new ObjectMapper();
                    Gson gson = new GsonBuilder()
                            .setDateFormat("yyyy-MM-dd").create();

                    TripGenerateDTO trip = new TripGenerateDTO();
                    log.info("Insert to DB ");
                    log.info("----------------------------------------- ");
                    List<ServiceInstance> locationInstances = discoveryClient.getInstances("Location_Service");
                    ServiceInstance locationInstance = instances.get(0);
                    DesDetailsDTO destination = restTemplateClient.restTemplate().getForObject(locationInstance.getUri()+"/api/destination/"+input.getDestinationId(), DesDetailsDTO.class);
                    trip.setName(data.getDayOfTrip() + " days in " +destination.getName());
                    trip.setBudget(input.getBudget());
                    trip.setStartDate(input.getStartDate());
                    trip.setEndDate(input.getEndDate());
                    trip.setUserId(input.getUserId());
                    String personJsonObject = gson.toJson(input);
                    HttpEntity<String> request =
                            new HttpEntity<String>(personJsonObject, headers);
                    System.out.println(request);

                    int id= restTemplateClient.restTemplate().postForObject(instance.getUri()+"/trip/insert", request, Integer.class);

                    Trip tour = s.toTrip(data);



                    for (TripDetails poi : tour.getListTripDetails()
                    ) {
                        TripExpense ex = new TripExpense();
                        TripDetailsGenerateDTO detailsGenerateDTO = new TripDetailsGenerateDTO();
                        detailsGenerateDTO.setDate(String.valueOf(poi.getDayNumber()));
                        detailsGenerateDTO.setStartTime(String.valueOf(poi.getStartTime()));
                        detailsGenerateDTO.setEndTime(String.valueOf(poi.getEndTime()));
                        detailsGenerateDTO.setTripId(String.valueOf(id));
                        detailsGenerateDTO.setNote("");
                        String nodeObject = gson.toJson(detailsGenerateDTO);
                        HttpEntity<String> request1 =
                                new HttpEntity<String>(nodeObject, headers);
                        int poiId= restTemplateClient.restTemplate().postForObject(instance.getUri()+"/trip/add-detail-generated", request1, Integer.class);

                        ExpenseDTO expenseDTO = new ExpenseDTO();
                        POI p = (POI) poi.getMasterActivity();
                        expenseDTO.setAmmount((int) p.getTypicalPrice());
                        expenseDTO.setDescription(poi.getMasterActivity().getName());
                        expenseDTO.setTripId(id);
                        expenseDTO.setDetails(poiId);
                        String nodeObject2 = gson.toJson(expenseDTO);
                        HttpEntity<String> request2 =
                                new HttpEntity<String>(personJsonObject, headers);
                        restTemplateClient.restTemplate().postForObject(instance.getUri()+"/trip/insertGenerate", request2, String.class);


                    }


                }
            });
        return task;


        }


    }
