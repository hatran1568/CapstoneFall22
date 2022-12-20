package com.tripplanner.Optimizer.service;


import com.tripplanner.Optimizer.DTO.*;
import com.tripplanner.Optimizer.DTO.Response.ComplexResponse;
import com.tripplanner.Optimizer.DTO.Response.DesDetailsDTO;
import com.tripplanner.Optimizer.DTO.Response.UserDetailResponseDTO;
import com.tripplanner.Optimizer.DTO.request.ExpenseDTO;
import com.tripplanner.Optimizer.DTO.request.TripDetailsGenerateDTO;
import com.tripplanner.Optimizer.DTO.request.TripGenerateDTO;
import com.tripplanner.Optimizer.algorithms.GeneticAlgorithmImplementer;
import com.tripplanner.Optimizer.config.RestTemplateClient;


import com.tripplanner.Optimizer.entity.OptimizerRequest;
import com.tripplanner.Optimizer.entity.RequestStatus;
import com.tripplanner.Optimizer.service.interfaces.GenerateTrip;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tripplanner.Optimizer.repository.RequestRepository;
import com.tripplanner.Optimizer.utils.MailSenderManager;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.core.env.Environment;
import org.springframework.http.*;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GenerateTripIml implements GenerateTrip {

    @Autowired
    MailSenderManager mailSender;

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
    public CompletableFuture<ComplexResponse> generateTrip(GenerateTripUserInput input, String baseUrl,String token) throws ExecutionException, InterruptedException {
        CompletableFuture<ComplexResponse> task = new CompletableFuture<>();
        OptimizerRequest r = new OptimizerRequest();
        r.setTrip(null);
        r.setUser(input.getUserId());
        r.setUri(baseUrl);
        r.setStatus(RequestStatus.IN_PROGRESS);
        OptimizerRequest saved= repository.save(r);
        repository.changeInProgress(saved.getRequestId(), input.getUserId());
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        //java.util.Date parsed = format.parse(input.getStartDate());
        Date sDate = input.getStartDate();
        //parsed = format.parse(tripGenerateDTO.getEndDate());
        Date eDate = input.getEndDate();
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");

        ServiceInstance instance = instances.get(0);

        ListPoi listPoi = restTemplateClient.restTemplate().getForObject(instance.getUri() + "/location/api/pois/poisByDestination/" + input.getDestinationId(), ListPoi.class);

        int numberOfPOI = listPoi.getList().size();
        POI[] POIs = new POI[numberOfPOI];
        for (int i = 0; i < listPoi.getList().size(); i++) {
            POIs[i] = listPoi.getList().get(i);
        }

        double[][] distanceOfPOI = new double[numberOfPOI][numberOfPOI];
        for (int i = 0; i < numberOfPOI; i++) {
            for (int j = 0; j < numberOfPOI; j++) {
                if (i == j)
                    distanceOfPOI[i][j] = 0;
                else {
                    distanceOfPOI[i][j] = restTemplateClient.restTemplate().getForObject(instance.getUri() + "/location/api/pois/distance/" + POIs[i].getActivityId() + "/" + POIs[j].getActivityId(), Double.class);

                }
            }
        }
        String serverPort = environment.getProperty("local.server.port");

        Data data = new Data(sDate, eDate, distanceOfPOI, POIs, numberOfPOI, input.getUserPreference(), input.getBudget(), input.getStartTime(), input.getEndTime(), input.getUserId());
        GeneticAlgorithmImplementer ga = new GeneticAlgorithmImplementer(data);
        Solution s = ga.implementGA(data);




        task.complete(new ComplexResponse(s,data,input,saved,token));
//        repository.insert(RequestStatus.IN_PROGRESS.name(), baseUrl, input.getUserId());

        return task;


        }
@Override
    public CompletableFuture<ComplexResponse> insertToDB(ComplexResponse response) throws ExecutionException, InterruptedException {

        Solution s =response.getS();
        Data data = response.getData();
        GenerateTripUserInput input =response.getInput();
        repository.changeSuccess(input.getUserId());
        OptimizerRequest optimizerRequest = response.getRequest();
    optimizerRequest.setStatus(RequestStatus.COMPLETE);
    optimizerRequest = repository.save(optimizerRequest);


        log.info("Insert to DB ");
        log.info("----------------------------------------- ");
        TripGenerateDTO trip = new TripGenerateDTO();
        CompletableFuture<ComplexResponse> task = new CompletableFuture<>();
        List<ServiceInstance> locationInstances = discoveryClient.getInstances("location-service");
        HttpHeaders headers = new HttpHeaders();
        List<ServiceInstance> instances = discoveryClient.getInstances("trip-service");

        ServiceInstance     instance = instances.get(0);
        headers.setContentType(MediaType.APPLICATION_JSON);
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd").create();
        ServiceInstance locationInstance = locationInstances.get(0);
        DesDetailsDTO destination = restTemplateClient.restTemplate().getForObject(locationInstance.getUri()+"/location/api/destination/"+input.getDestinationId(), DesDetailsDTO.class);
        trip.setName(data.getDayOfTrip() + " days in " +destination.getName());
        trip.setBudget(input.getBudget());
        trip.setStartDate(input.getStartDate());
        trip.setEndDate(input.getEndDate());
        trip.setUserId(input.getUserId());
        String personJsonObject = gson.toJson(trip);
        HttpEntity<String> request =
                new HttpEntity<String>(personJsonObject, headers);
        System.out.println(request);

        int id= restTemplateClient.restTemplate().postForObject(instance.getUri()+"/trip/insert", request, Integer.class);
        optimizerRequest.setTrip(id);
        optimizerRequest = repository.save(optimizerRequest);
        Trip tour = s.toTrip(data);
        repository.changeSuccess(input.getUserId());


        for (TripDetails poi : tour.getListTripDetails()
        ) {
            headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            TripExpense ex = new TripExpense();
            TripDetailsGenerateDTO detailsGenerateDTO = new TripDetailsGenerateDTO();
            detailsGenerateDTO.setDate(String.valueOf(poi.getDayNumber()));
            detailsGenerateDTO.setStartTime(String.valueOf(poi.getStartTime()));
            detailsGenerateDTO.setEndTime(String.valueOf(poi.getEndTime()));
            detailsGenerateDTO.setTripId(String.valueOf(id));
            detailsGenerateDTO.setActivityId(String.valueOf(poi.getMasterActivity().getActivityId()));
            detailsGenerateDTO.setNote("");
            String nodeObject = gson.toJson(detailsGenerateDTO);
            HttpEntity<String> request1 =
                    new HttpEntity<String>(nodeObject, headers);
            int poiId= restTemplateClient.restTemplate().postForObject(instance.getUri()+"/trip/add-detail-generated", request1, Integer.class);
            headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            ExpenseDTO expenseDTO = new ExpenseDTO();
            POI p = (POI) poi.getMasterActivity();
            expenseDTO.setAmount((int) p.getTypicalPrice());
            expenseDTO.setDescription(poi.getMasterActivity().getName());
            expenseDTO.setTripId(id);
            expenseDTO.setDetails(poiId);
            String nodeObject2 = gson.toJson(expenseDTO);
            HttpEntity<String> request2 =
                    new HttpEntity<String>(nodeObject2, headers);
            restTemplateClient.restTemplate().postForObject(instance.getUri()+"/trip/api/insertGenerated", request2, String.class);
        response.setRequest(optimizerRequest);

        }
        task.complete(response);
        task.whenComplete(new BiConsumer<ComplexResponse, Throwable>() {
            @Override
            public void accept(ComplexResponse response, Throwable throwable) {

                List<ServiceInstance> userInstances = discoveryClient.getInstances("user-service");
                ServiceInstance userInstance = userInstances.get(0);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", response.getToken());
                HttpEntity<String> request2 =
                        new HttpEntity<String>(headers);
                ResponseEntity<UserDetailResponseDTO> user = restTemplateClient.restTemplate().exchange(userInstance.getUri()+"/user/api/user/findById/"+input.getUserId(), HttpMethod.GET,request2, UserDetailResponseDTO.class);
                String emailContent = "dear "+user.getBody().getName()+",\n \n"
                        + "See your trip at http://localhost:3000/timeline/"+response.getRequest().getTrip() ;
                mailSender.sendSimpleMessage(user.getBody().getEmail(), "Your trip is ready", emailContent);
                log.info(String.valueOf(System.currentTimeMillis() / 1000));
            }
        });
        return  task;

    }


    }
