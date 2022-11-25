package com.example.TripService.service.implementers;

import com.example.TripService.config.RestTemplateClient;
import com.example.TripService.dto.request.CustomActivityDTO;
import com.example.TripService.dto.response.*;
import com.example.TripService.entity.Trip;
import com.example.TripService.entity.TripDetails;
import com.example.TripService.entity.TripStatus;
import com.example.TripService.repository.ExpenseCategoryRepository;
import com.example.TripService.repository.ExpenseRepository;
import com.example.TripService.repository.TripDetailRepository;
import com.example.TripService.repository.TripRepository;
import com.example.TripService.service.interfaces.TripService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {
    @Autowired
    ModelMapper mapper;
    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private TripDetailRepository tripDetailRepository;

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;
    @Autowired
    RestTemplateClient restTemplateClient;
    @Autowired
    private DiscoveryClient discoveryClient;
    @Override
    public DetailedTripDTO getDetailedTripById(int tripId,int userId) {
        Trip trip = tripRepository.findById(tripId);
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");

        ServiceInstance instance = instances.get(0);
        if(trip == null) return null;
        if(trip.getStatus() == TripStatus.PRIVATE && trip.getUser()!=userId) return null;
        List<TripDetailsQueryDTO> tripDetailedDTO = tripDetailRepository.getTripDetailsByTrip(tripId);
        List<TripDetailDTO> tripDetailDTOS = new ArrayList<>();

        for (TripDetailsQueryDTO query: tripDetailedDTO
             ) {
            Boolean isCustom= restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois/isExistCustom/"+query.getMasterActivity(), Boolean.class);
            TripDetailDTO dto = new TripDetailDTO();
            dto.setNote(query.getNote());
            dto.setDate(getDateByStartDateAndDayNumber((Date) trip.getStartDate(), query.getDayNumber()));
            dto.setStartTime(query.getStartTime());
            dto.setEndTime(query.getEndTime());
            dto.setTripDetailsId(query.getDetailsId());
            if(isCustom){
                MasterActivityDTO masterActivityDTO = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois/getMasterActivity/"+query.getMasterActivity(),MasterActivityDTO.class);
                dto.setMasterActivity(masterActivityDTO);
            }
            else{
                com.example.TripService.dto.POIDTO  masterActivityDTO = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois/getMasterActivity/"+query.getMasterActivity(),com.example.TripService.dto.POIDTO.class);
                dto.setMasterActivity(masterActivityDTO);
            }

            dto.setDayNumber(query.getDayNumber());


            tripDetailDTOS.add(dto);

        }
        DetailedTripDTO detailedTripDTO = mapper.map(trip, DetailedTripDTO.class);
        detailedTripDTO.setListTripDetails((ArrayList<TripDetailDTO>) tripDetailDTOS);




        return detailedTripDTO;
    }
    public ArrayList<TripDetailDTO> getListTripDetailDTO(Trip trip){
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getListByTripId(trip.getTripId());
        Date startDate = (Date) trip.getStartDate();
        ArrayList<TripDetailDTO> tripDetailDTOS = new ArrayList<>();
        for (TripDetails tripDetail: tripDetails) {
            TripDetailDTO tripDetailDTO = mapper.map(tripDetail, TripDetailDTO.class);
            int masterActivityDTO = tripDetailDTO.getMasterActivity().getActivityId();
            tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityDTO));
            tripDetailDTO.setDate(getDateByStartDateAndDayNumber(startDate, tripDetailDTO.getDayNumber()));
            tripDetailDTOS.add(tripDetailDTO);
        }
        return tripDetailDTOS;
    }
    @Override
    public TripGeneralDTO getTripGeneralById(int id) {
        Trip trip = tripRepository.findById(id);
        if (trip == null) return null;
        TripGeneralDTO tripGeneralDTO = mapper.map(trip, TripGeneralDTO.class);
        tripGeneralDTO.setImage(getFirstPOIImage(trip.getTripId()));
        return tripGeneralDTO;
    }
    @Override
    public TripGeneralDTO cloneTrip(int userId, int tripId, Date startDate){
        Trip originalTrip = tripRepository.findById(tripId);


        int numberOfDays = getDayNumberByFromStartDate((Date) originalTrip.getStartDate(), (Date) originalTrip.getEndDate());
        Date endDate = getDateByStartDateAndDayNumber(startDate, numberOfDays);

        tripRepository.createEmptyTrip(new Date(Calendar.getInstance().getTime().getTime()),new Date(Calendar.getInstance().getTime().getTime()),TripStatus.PRIVATE.name(),originalTrip.getBudget(),originalTrip.getName(),userId,startDate,endDate);
        int id = tripRepository.getNewestTripId();
        Trip newTrip = tripDetailRepository.findById(id).get().getTrip();
        TripGeneralDTO saved = mapper.map(newTrip, TripGeneralDTO.class);
        cloneTripDetails(tripId, saved.getTripId());
        return saved;
    }
    private void cloneTripDetails(int tripId, int newTripId){
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getListByTripId(tripId);
        Trip newTrip = new Trip();
        newTrip.setTripId(newTripId);
        for (TripDetails detail:tripDetails) {
            TripDetails newDetail = new TripDetails();

            List<ServiceInstance> instances = discoveryClient.getInstances("location-service");

            ServiceInstance instance = instances.get(0);

            int activityId = detail.getMasterActivity();
            Boolean isExist = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois/isExistCustom/"+activityId, Boolean.class);
            if(isExist){
                activityId = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois/cloneCustom/"+activityId, Integer.class);
                tripRepository.insertTripDetails(detail.getDayNumber(),detail.getEndTime(), detail.getNote(),detail.getStartTime(),activityId,newTripId);
                tripDetailRepository.save(newDetail);
            }
            else {
                tripRepository.insertTripDetails(detail.getDayNumber(),detail.getEndTime(), detail.getNote(),detail.getStartTime(),activityId,newTripId);
                tripDetailRepository.save(newDetail);
                addPOICostToExpenses(newTripId, activityId);
            }



        }
    }
    @Override
    public TripDetailDTO addTripDetail(Date date, int startTime, int endTime, int activityId, int tripId, String note) {
        Trip trip = tripRepository.findById(tripId);
        TripDetails tripDetails = new TripDetails();
        tripDetails.setDayNumber(getDayNumberByFromStartDate((Date) trip.getStartDate(), date));
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);
        tripRepository.insertTripDetails(getDayNumberByFromStartDate((Date) trip.getStartDate(), date),endTime,note,startTime,activityId,tripId);
        int id= tripDetailRepository.getLastestTripDetails();
        TripDetailDTO saved = new TripDetailDTO();
        saved.setDate(date);
        saved.setTripDetailsId(id);
        saved.setStartTime(startTime);
        saved.setEndTime(endTime);
        saved.setNote(note);
        return saved;
    }

    @Override
    public Integer addTripDetailGenerated(int day, int startTime, int endTime, int activityId, int tripId, String note) {
        tripRepository.insertTripDetails(day,endTime,note,startTime,activityId,tripId);

        return tripDetailRepository.getLastestTripDetails();
    }

    //add an expense to trip with typical price of POI
    public void addPOICostToExpenses(int tripId, int activityId){
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");

        ServiceInstance instance = instances.get(0);
        POIDTO poidto = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois/getPoiById/"+activityId, POIDTO.class);
        expenseRepository.insertExpense(poidto.getTypicalPrice(),poidto.getName(),tripId,activityId);

    }
    public MasterActivityDTO getMasterActivity(int id){
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");

        ServiceInstance instance = instances.get(0);
        MasterActivityDTO results = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois//getMasterActivity/"+id,com.example.TripService.dto.POIDTO.class);
        return  results;
    }

    @Override
    public TripDetailDTO addCustomTripDetail(Date date, int startTime, int endTime, int tripId, String name, String address) {
        Trip trip = tripRepository.findById(tripId);
        List<ServiceInstance> instances = discoveryClient.getInstances("trip-service");

        ServiceInstance instance = instances.get(0);
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        ObjectMapper mapper = new ObjectMapper();
        CustomActivityDTO customActivityDTO =new CustomActivityDTO();
        customActivityDTO.setAddress(address);
        customActivityDTO.setName(name);
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd").create();
        String personJsonObject = gson.toJson(customActivityDTO);
        HttpEntity<String> request =
                new HttpEntity<String>(personJsonObject, headers);
        Integer id = restTemplateClient.restTemplate().postForObject(instance.getUri()+"/location/api/pois/addCustom",request, Integer.class);

        TripDetailDTO saved = addTripDetail(date,startTime,endTime,id,tripId,"");
        return saved;
    }

    @Override
    public void deleteDetailById(int id) {
        tripDetailRepository.deleteById(id);
    }

    @Override
    public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to) {
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");

        ServiceInstance instance = instances.get(0);
        Double distance =restTemplateClient.restTemplate().getForObject(instance.getUri() + "/location/api/pois/distance/" + from + "/" + to, Double.class);
        return Optional.ofNullable(distance);
    }

    @Override
    public TripDetailDTO getTripDetailById(int id) {
        TripDetails tripDetails = tripDetailRepository.getTripDetailsById(id);
        if(tripDetails == null) return null;
        TripDetailDTO tripDetailDTO = mapper.map(tripDetails, TripDetailDTO.class);
        int masterActivityId = tripDetailDTO.getMasterActivity().getActivityId();
        tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityId));
        Trip trip = tripDetails.getTrip();
        Date newDate = getDateByStartDateAndDayNumber((Date) trip.getStartDate(), tripDetails.getDayNumber());
        tripDetailDTO.setDate(newDate);
        return tripDetailDTO;
    }
    private Date getDateByStartDateAndDayNumber(Date startDate, int dayNumber){
        Calendar c = Calendar.getInstance();
        c.setTime(startDate);
        c.add(Calendar.DATE, dayNumber-1);
        return new Date(c.getTimeInMillis());
    }
    private int getDayNumberByFromStartDate(Date tripStartDate, Date date){
        LocalDate dateBefore = tripStartDate.toLocalDate();
        LocalDate dateAfter = date.toLocalDate();
        long noOfDaysBetween = ChronoUnit.DAYS.between(dateBefore, dateAfter);
        return (int) noOfDaysBetween +1;
    }
    @Override
    public TripDetailDTO editTripDetailById(TripDetailDTO newDetail, int id) {
        return tripDetailRepository.findById(id)
                .map(detail -> {
                    Trip trip = detail.getTrip();
                    detail.setDayNumber(getDayNumberByFromStartDate((Date) trip.getStartDate(), newDetail.getDate()));
                    detail.setStartTime(newDetail.getStartTime());
                    detail.setEndTime(newDetail.getEndTime());
                    detail.setNote(newDetail.getNote());
                    TripDetailDTO saved = mapper.map(tripDetailRepository.save(detail), TripDetailDTO.class);
                    int masterActivityId = saved.getMasterActivity().getActivityId();
                    saved.setMasterActivity(getMasterActivity(masterActivityId));
                    Date newDate = getDateByStartDateAndDayNumber((Date) trip.getStartDate(), saved.getDayNumber());
                    saved.setDate(newDate);
                    return saved;
                })
                .orElseGet(() -> {
                    return null;
                });
    }

    @Override
    public TripDetailDTO editCustomTripDetailById(TripDetailDTO newDetail, int detailId, int tripId) {
        MasterActivityDTO masterActivity = newDetail.getMasterActivity();
        int maId = masterActivity.getActivityId();
        List<ServiceInstance> instances = discoveryClient.getInstances("trip-service");

        ServiceInstance instance = instances.get(0);
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        ObjectMapper mapper = new ObjectMapper();

        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd").create();
        String personJsonObject = gson.toJson(newDetail);
        HttpEntity<String> request =
                new HttpEntity<String>(personJsonObject, headers);
        restTemplateClient.restTemplate().postForObject(instance.getUri()+"/location/api/pois/editCustom",request, String.class);

        return editTripDetailById(newDetail, detailId);
    }

    @Override
    public List<TripGeneralDTO> getTripsByUser(int userId) {
        ArrayList<Trip> trips = tripRepository.getTripsByUser(userId);

        return trips.stream().map(trip -> {
            TripGeneralDTO tripDTO = new TripGeneralDTO();
            tripDTO.setTripId(trip.getTripId());
            tripDTO.setName(trip.getName());
            tripDTO.setBudget(trip.getBudget());
            tripDTO.setStartDate(trip.getStartDate());
            tripDTO.setEndDate(trip.getEndDate());
            tripDTO.setImage(getFirstPOIImage(trip.getTripId()));
            tripDTO.setDateModified(trip.getDateModified());
            return tripDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteTripById(int id) {
        tripRepository.deleteTripById(id);
    }

    @Override
    public List<TripGeneralDTO> getLast3TripsByUser(int userId) {
        ArrayList<Trip> trips = tripRepository.getLast3TripsByUser(userId);
        List<TripGeneralDTO> results = trips.stream().map(trip -> {
            TripGeneralDTO tripDTO = new TripGeneralDTO();
            tripDTO.setTripId(trip.getTripId());
            tripDTO.setName(trip.getName());
            tripDTO.setBudget(trip.getBudget());
            tripDTO.setStartDate(trip.getStartDate());
            tripDTO.setEndDate(trip.getEndDate());
            tripDTO.setImage(getFirstPOIImage(trip.getTripId()));
            tripDTO.setDateModified(trip.getDateModified());
            return tripDTO;
        }).collect(Collectors.toList());
        int a =1;
        return results;
    }

    @Override
    public int countTripByUser(int userId) {
        return tripRepository.getNumberOfTripsByUser(userId);
    }

    @Override
    public void editTripName(int tripId, String name) {
        tripRepository.updateTripName(tripId, name);
    }
    @Override
    public void editStartAndEndDates(int tripId, Date startDate, Date endDate){
        int numberOfDays = getDayNumberByFromStartDate(startDate, endDate);
        tripRepository.updateStartAndEndDates(tripId, startDate, endDate);
        tripDetailRepository.deleteByRange(tripId, numberOfDays);
    }
    public List<TripDetailDTO> getTripDetailsToBeDeleted(int tripId, int numberOfDays){
        Trip trip = tripRepository.findById(tripId);
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getTripDetailsOutOfRange(tripId, numberOfDays);
        ArrayList<TripDetailDTO> tripDetailDTOS = new ArrayList<>();
        for (TripDetails tripDetail: tripDetails) {
            TripDetailDTO tripDetailDTO = mapper.map(tripDetail, TripDetailDTO.class);
            MasterActivityDTO masterActivityDTO = tripDetailDTO.getMasterActivity();
            tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityDTO.getActivityId()));
            tripDetailDTO.setDate(getDateByStartDateAndDayNumber((Date) trip.getStartDate(), tripDetailDTO.getDayNumber()));
            tripDetailDTOS.add(tripDetailDTO);
        }
        return tripDetailDTOS;
    }

    @Override
    public boolean tripExists(int tripId){
        return tripRepository.existsById(tripId);
    }


    private String getFirstPOIImage(int tripId) {
        TripDetails tripDetails = tripDetailRepository.findFirstInTrip(tripId);
        if (tripDetails == null) return null;
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");

        ServiceInstance instance = instances.get(0);
        String url = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/location/api/pois/getFirstImg/"+tripDetails.getMasterActivity(),String.class);
        return  url;
    }
    public void insertExpense(double amount,String description, int trip_id,int details){
        expenseRepository.insertExpense(amount,description, trip_id,details);

    }
}
