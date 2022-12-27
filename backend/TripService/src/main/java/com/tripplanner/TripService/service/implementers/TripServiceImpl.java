package com.tripplanner.TripService.service.implementers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tripplanner.TripService.config.RestTemplateClient;
import com.tripplanner.TripService.dto.POIDTO;
import com.tripplanner.TripService.dto.request.CustomActivityDTO;
import com.tripplanner.TripService.dto.response.*;
import com.tripplanner.TripService.entity.Trip;
import com.tripplanner.TripService.entity.TripDetails;
import com.tripplanner.TripService.entity.TripStatus;
import com.tripplanner.TripService.repository.ExpenseCategoryRepository;
import com.tripplanner.TripService.repository.ExpenseRepository;
import com.tripplanner.TripService.repository.TripDetailRepository;
import com.tripplanner.TripService.repository.TripRepository;
import com.tripplanner.TripService.service.interfaces.TripService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
    RestTemplateClient restTemplateClient;
    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private TripDetailRepository tripDetailRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;
    @Autowired
    private DiscoveryClient discoveryClient;

    @Override
    public DetailedTripDTO getDetailedTripById(int tripId, int userId) {
        if (userId < 1) userId = getGuestId();
        Trip trip = tripRepository.findById(tripId);
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        if (trip == null) return null;
        if (trip.getStatus() == TripStatus.PRIVATE && trip.getUser() != userId) return null;
        List<TripDetailsQueryDTO> tripDetailedDTO = tripDetailRepository.getTripDetailsByTrip(tripId);
        ArrayList<TripDetailDTO> tripDetailDTOS = new ArrayList<>();

        for (TripDetailsQueryDTO query : tripDetailedDTO) {
            Boolean isCustom = restTemplateClient
                    .restTemplate()
                    .getForObject(
                            instance.getUri() + "/location/api/pois/isExistCustom/" + query.getMasterActivity(),
                            Boolean.class
                    );
            TripDetailDTO dto = new TripDetailDTO();
            dto.setNote(query.getNote());
            dto.setDate(getDateByStartDateAndDayNumber((Date) trip.getStartDate(), query.getDayNumber()));
            dto.setStartTime(query.getStartTime());
            dto.setEndTime(query.getEndTime());
            dto.setTripDetailsId(query.getDetailsId());
            if (Boolean.TRUE.equals(isCustom)) {
                MasterActivityDTO masterActivityDTO = restTemplateClient
                        .restTemplate()
                        .getForObject(
                                instance.getUri() + "/location/api/pois/getMasterActivity/" + query.getMasterActivity(),
                                MasterActivityDTO.class
                        );
                dto.setMasterActivity(masterActivityDTO);
            } else {
                POIDTO masterActivityDTO = restTemplateClient
                        .restTemplate()
                        .getForObject(
                                instance.getUri() + "/location/api/pois/getMasterActivity/" + query.getMasterActivity(),
                                POIDTO.class
                        );
                dto.setMasterActivity(masterActivityDTO);
            }
            dto.setDayNumber(query.getDayNumber());
            tripDetailDTOS.add(dto);
        }
        DetailedTripDTO detailedTripDTO = mapper.map(trip, DetailedTripDTO.class);
        detailedTripDTO.setListTripDetails(tripDetailDTOS);
        return detailedTripDTO;
    }

//    public ArrayList<TripDetailDTO> getListTripDetailDTO(Trip trip) {
//        ArrayList<TripDetails> tripDetails = tripDetailRepository.getListByTripId(trip.getTripId());
//        Date startDate = (Date) trip.getStartDate();
//        ArrayList<TripDetailDTO> tripDetailDTOS = new ArrayList<>();
//        for (TripDetails tripDetail : tripDetails) {
//            TripDetailDTO tripDetailDTO = mapper.map(tripDetail, TripDetailDTO.class);
//            int masterActivityDTO = tripDetailDTO.getMasterActivity().getActivityId();
//            tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityDTO));
//            tripDetailDTO.setDate(getDateByStartDateAndDayNumber(startDate, tripDetailDTO.getDayNumber()));
//            tripDetailDTOS.add(tripDetailDTO);
//        }
//        return tripDetailDTOS;
//    }

    @Override
    public TripGeneralDTO getTripGeneralById(int id) {
        Trip trip = tripRepository.findById(id);
        if (trip == null) return null;
        TripGeneralDTO tripGeneralDTO = mapper.map(trip, TripGeneralDTO.class);
        tripGeneralDTO.setImage(getFirstPOIImage(trip.getTripId()));
        return tripGeneralDTO;
    }

    @Override
    public TripGeneralDTO cloneTrip(int userId, int tripId, Date startDate) {
        Trip originalTrip = tripRepository.findById(tripId);
        if (userId < 1) userId = getGuestId();
        int numberOfDays = getDayNumberByFromStartDate((Date) originalTrip.getStartDate(), (Date) originalTrip.getEndDate());
        Date endDate = getDateByStartDateAndDayNumber(startDate, numberOfDays);
        Trip trip = new Trip();
        trip.setStartDate(startDate);
        trip.setEndDate(endDate);
        trip.setUser(userId);
        trip.setName(originalTrip.getName());
        trip.setStatus(TripStatus.PRIVATE);
        trip.setBudget(originalTrip.getBudget());
        Date now = new Date(Calendar.getInstance().getTime().getTime());
        trip.setDateCreated(now);
        trip.setDateModified(now);
//        tripRepository.createEmptyTrip(new Date(Calendar.getInstance().getTime().getTime()),new Date(Calendar.getInstance().getTime().getTime()),TripStatus.PRIVATE.name(),originalTrip.getBudget(),originalTrip.getName(),userId,startDate,endDate);
//        int id = tripRepository.getNewestTripId();
//        Trip newTrip = tripDetailRepository.findById(id).get().getTrip();
        Trip newTrip = tripRepository.save(trip);
        TripGeneralDTO saved = mapper.map(newTrip, TripGeneralDTO.class);
        cloneTripDetails(tripId, saved.getTripId());
        return saved;
    }

    private void cloneTripDetails(int tripId, int newTripId) {
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getListByTripId(tripId);
        Trip newTrip = new Trip();
        newTrip.setTripId(newTripId);
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        for (TripDetails detail : tripDetails) {
            TripDetails newDetail = new TripDetails();
            int activityId = detail.getMasterActivity();
            Boolean isExist = restTemplateClient
                    .restTemplate()
                    .getForObject(
                            instance.getUri() + "/location/api/pois/isExistCustom/" + activityId,
                            Boolean.class
                    );
            if (Boolean.TRUE.equals(isExist)) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                activityId = restTemplateClient
                        .restTemplate()
                        .postForObject(
                                instance.getUri() + "/location/api/pois/cloneCustom/" + activityId,
                                new HttpEntity<>("", headers),
                                Integer.class
                        );
                tripRepository
                        .insertTripDetails(
                                detail.getDayNumber(),
                                detail.getEndTime(),
                                detail.getNote(),
                                detail.getStartTime(),
                                activityId, newTripId
                        );
                tripDetailRepository.save(newDetail);
            } else {
                newDetail.setMasterActivity(activityId);
                newDetail.setTrip(newTrip);
                newDetail.setNote(detail.getNote());
                newDetail.setDayNumber(detail.getDayNumber());
                newDetail.setStartTime(detail.getStartTime());
                newDetail.setEndTime(detail.getEndTime());
                TripDetails tdSaved = tripDetailRepository.save(newDetail);
                addPOICostToExpenses(newTripId, activityId, tdSaved.getTripDetailsId());
            }
        }
    }

    @Override
    public TripDetailDTO addTripDetail(
            Date date, int startTime, int endTime, int activityId, int tripId, String note
    ) {
//        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
//        ServiceInstance instance = instances.get(0);
        Trip trip = tripRepository.findById(tripId);
        TripDetails tripDetails = new TripDetails();
        tripDetails.setDayNumber(getDayNumberByFromStartDate((Date) trip.getStartDate(), date));
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);
        tripDetails.setMasterActivity(activityId);
        tripDetails.setTrip(trip);
        tripDetails.setNote(note);
        TripDetailDTO saved = mapper.map(tripDetailRepository.save(tripDetails), TripDetailDTO.class);
        saved.setMasterActivity(getMasterActivity(activityId));
        saved.setDate(date);
        return saved;
    }

    @Override
    public Integer addTripDetailGenerated(
            int day, int startTime, int endTime, int activityId, int tripId, String note
    ) {
        TripDetails td = new TripDetails();
        Trip t = new Trip();
        t.setTripId(tripId);
        td.setTrip(t);
        td.setNote(note);
        td.setDayNumber(day);
        td.setStartTime(startTime);
        td.setEndTime(endTime);
        td.setMasterActivity(activityId);
        TripDetails saved = tripDetailRepository.save(td);
        //tripRepository.insertTripDetails(day,endTime,note,startTime,activityId,tripId);
        return saved.getTripDetailsId();
    }

    //add an expense to trip with typical price of POI
    public void addPOICostToExpenses(int tripId, int activityId, int detailId) {
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        com.tripplanner.TripService.dto.response.POIDTO poidto =
                restTemplateClient
                        .restTemplate()
                        .getForObject(
                                instance.getUri() + "/location/api/pois/getPoiById/" + activityId,
                                com.tripplanner.TripService.dto.response.POIDTO.class
                        );
        expenseRepository.insertExpense(poidto.getTypicalPrice(), poidto.getName(), tripId, detailId);
    }

    public MasterActivityDTO getMasterActivity(int id) {
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        return restTemplateClient
                .restTemplate()
                .getForObject(
                        instance.getUri() + "/location/api/pois//getMasterActivity/" + id,
                        POIDTO.class
                );
    }

    @Override
    public TripDetailDTO addCustomTripDetail(
            Date date, int startTime, int endTime, int tripId, String name, String address, String note
    ) {
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        CustomActivityDTO customActivityDTO = new CustomActivityDTO();
        customActivityDTO.setAddress(address);
        customActivityDTO.setName(name);
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
        String personJsonObject = gson.toJson(customActivityDTO);
        HttpEntity<String> request = new HttpEntity<>(personJsonObject, headers);
        Integer id = restTemplateClient
                .restTemplate()
                .postForObject(
                        instance.getUri() + "/location/api/pois/addCustom",
                        request,
                        Integer.class
                );
        TripDetailDTO saved = addTripDetail(date, startTime, endTime, id, tripId, note);
        saved.setMasterActivity(getMasterActivity(id));
        return saved;
    }

    @Override
    public void deleteDetailById(int id) {
        expenseRepository.deleteByActivity(id);
        tripDetailRepository.deleteById(id);
    }

    @Override
    public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to) {
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        Double distance = restTemplateClient
                .restTemplate()
                .getForObject(
                        instance.getUri() + "/location/api/pois/distance/" + from + "/" + to,
                        Double.class
                );
        return Optional.ofNullable(distance);
    }

    @Override
    public TripDetailDTO getTripDetailById(int id) {
        TripDetails tripDetails = tripDetailRepository.getTripDetailsById(id);
        if (tripDetails == null) return null;
        TripDetailDTO tripDetailDTO = mapper.map(tripDetails, TripDetailDTO.class);
        int masterActivityId = tripDetailDTO.getMasterActivity().getActivityId();
        tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityId));
        Trip trip = tripDetails.getTrip();
        Date newDate = getDateByStartDateAndDayNumber((Date) trip.getStartDate(), tripDetails.getDayNumber());
        tripDetailDTO.setDate(newDate);
        return tripDetailDTO;
    }

    private Date getDateByStartDateAndDayNumber(Date startDate, int dayNumber) {
        Calendar c = Calendar.getInstance();
        c.setTime(startDate);
        c.add(Calendar.DATE, dayNumber - 1);
        return new Date(c.getTimeInMillis());
    }

    private int getDayNumberByFromStartDate(Date tripStartDate, Date date) {
        LocalDate dateBefore = tripStartDate.toLocalDate();
        LocalDate dateAfter = date.toLocalDate();
        long noOfDaysBetween = ChronoUnit.DAYS.between(dateBefore, dateAfter);
        return (int) noOfDaysBetween + 1;
    }

    @Override
    public TripDetailDTO editTripDetailById(TripDetailDTO newDetail, int id) {
        return tripDetailRepository.findById(id).map(detail -> {
            Trip trip = detail.getTrip();
            detail.setDayNumber(getDayNumberByFromStartDate((Date) trip.getStartDate(), newDetail.getDate()));
            detail.setStartTime(newDetail.getStartTime());
            detail.setEndTime(newDetail.getEndTime());
            detail.setNote(newDetail.getNote());
            TripDetailDTO saved = mapper.map(tripDetailRepository.save(detail), TripDetailDTO.class);
            int masterActivityId = detail.getMasterActivity();
            saved.setMasterActivity(getMasterActivity(masterActivityId));
            Date newDate = getDateByStartDateAndDayNumber((Date) trip.getStartDate(), saved.getDayNumber());
            saved.setDate(newDate);
            return saved;
        }).orElse(null);
    }

    @Override
    public TripDetailDTO editCustomTripDetailById(TripDetailDTO newDetail, int detailId, int tripId) {
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
        String personJsonObject = gson.toJson(newDetail);
        HttpEntity<String> request = new HttpEntity<>(personJsonObject, headers);
        restTemplateClient
                .restTemplate()
                .exchange(
                        instance.getUri() + "/location/api/pois/editCustom",
                        HttpMethod.PUT,
                        request,
                        String.class
                );
        return editTripDetailById(newDetail, detailId);
    }

    @Override
    public TripListDTO getTripsByUser(int userId, int page, int size) {
        ArrayList<Trip> trips = tripRepository.getTripsByUser(userId);

        Page<TripGeneralDTO> paging = listToPage(trips.stream().map(trip -> {
            TripGeneralDTO tripDTO = new TripGeneralDTO();
            tripDTO.setTripId(trip.getTripId());
            tripDTO.setName(trip.getName());
            tripDTO.setBudget(trip.getBudget());
            tripDTO.setStartDate(trip.getStartDate());
            tripDTO.setEndDate(trip.getEndDate());
            tripDTO.setImage(getFirstPOIImage(trip.getTripId()));
            tripDTO.setDateModified(trip.getDateModified());
            return tripDTO;
        }).collect(Collectors.toList()), page, size);
        TripListDTO tripListDTO = new TripListDTO();
        tripListDTO.setList(paging.getContent());
        tripListDTO.setTotalPage((int) Math.ceil(trips.size() / 10.0));
        tripListDTO.setCurrentPage(page);
        return tripListDTO;
    }

    private Page<TripGeneralDTO> listToPage(List<TripGeneralDTO> list, int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        int start = Math.min((int) paging.getOffset(), list.size());
        int end = Math.min((start + paging.getPageSize()), list.size());
        return new PageImpl<>(list.subList(start, end), PageRequest.of(page, size), list.size());
    }


    @Override
    public void deleteTripById(int id) {
        tripRepository.deleteTripById(id);
    }

    @Override
    public List<TripGeneralDTO> getLast3TripsByUser(int userId) {
        ArrayList<Trip> trips = tripRepository.getLast3TripsByUser(userId);
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
    public int countTripByUser(int userId) {
        return tripRepository.getNumberOfTripsByUser(userId);
    }

    @Override
    public void editTripName(int tripId, String name) {
        tripRepository.updateTripName(tripId, name);
    }
    @Override
    public void editTripBudget(int tripId, Double budget) {
        tripRepository.updateTripBudget(tripId, budget);
    }
    @Override
    public void editStartAndEndDates(int tripId, Date startDate, Date endDate) {
        int numberOfDays = getDayNumberByFromStartDate(startDate, endDate);
        tripRepository.updateStartAndEndDates(tripId, startDate, endDate);
        expenseRepository.deleteByRange(tripId, numberOfDays);
        tripDetailRepository.deleteByRange(tripId, numberOfDays);
    }

    public List<TripDetailDTO> getTripDetailsToBeDeleted(int tripId, int numberOfDays) {
        Trip trip = tripRepository.findById(tripId);
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getTripDetailsOutOfRange(tripId, numberOfDays);
        ArrayList<TripDetailDTO> tripDetailDTOS = new ArrayList<>();
        for (TripDetails tripDetail : tripDetails) {
            TripDetailDTO tripDetailDTO = mapper.map(tripDetail, TripDetailDTO.class);
            MasterActivityDTO masterActivityDTO = getMasterActivity(tripDetail.getMasterActivity());
            tripDetailDTO.setMasterActivity(masterActivityDTO);
            tripDetailDTO.setDate(getDateByStartDateAndDayNumber((Date) trip.getStartDate(), tripDetailDTO.getDayNumber()));
            tripDetailDTOS.add(tripDetailDTO);
        }
        return tripDetailDTOS;
    }

    @Override
    public boolean tripExists(int tripId) {
        return tripRepository.existsById(tripId);
    }

    private String getFirstPOIImage(int tripId) {
        TripDetails tripDetails = tripDetailRepository.findFirstInTrip(tripId);
        if (tripDetails == null) return null;
        List<ServiceInstance> instances = discoveryClient.getInstances("location-service");
        ServiceInstance instance = instances.get(0);
        return restTemplateClient
                .restTemplate()
                .getForObject(
                        instance.getUri() + "/location/api/pois/getFirstImg/" + tripDetails.getMasterActivity(),
                        String.class
                );
    }

    public void insertExpense(double amount, String description, int trip_id, int details) {
        expenseRepository.insertExpense(amount, description, trip_id, details);
    }

    @Override
    public ArrayList<PublicTripDTO> getPublicTrips(
            int page, int pageSize, String search, int minDays, int maxDays, Date earliest
    ) {
        ArrayList<Trip> trips = tripRepository
                .getPublicTrips(page * pageSize, pageSize, search, minDays, maxDays, earliest);
        ArrayList<PublicTripDTO> publicTripDTOS = new ArrayList<>();
        for (Trip trip : trips) {
            PublicTripDTO dto = mapper.map(trip, PublicTripDTO.class);
            dto.setImage(getFirstPOIImage(trip.getTripId()));
            dto.setDestinations(tripRepository.getDestinationsOfTrip(trip.getTripId()));
            dto.setNumberOfDays(getDayNumberByFromStartDate((Date) trip.getStartDate(), (Date) trip.getEndDate()));
            dto.setPois(tripRepository.getPOIsByTripId(trip.getTripId(), 5));
            publicTripDTOS.add(dto);
        }
        return publicTripDTOS;
    }

    @Override
    public int countPublicTrips(String search, int minDays, int maxDays, Date earliest) {
//        return 0;
        return tripRepository.getPublicTripsCount(search, minDays, maxDays, earliest);
    }

    @Override
    public void toggleStatus(int tripId, String status) {
        tripRepository.toggleStatus(tripId, status.trim().toUpperCase());
    }

    @Override
    public TripGeneralDTO createEmptyTrip(Double budget, String name, int userId, Date startDate, Date endDate) {
        if (userId < 1) userId = getGuestId();
        Trip trip = new Trip();
        trip.setStartDate(startDate);
        trip.setEndDate(endDate);
        trip.setUser(userId);
        trip.setName(name);
        trip.setBudget(budget);
        Date now = new Date(Calendar.getInstance().getTime().getTime());
        trip.setDateCreated(now);
        trip.setDateModified(now);
        trip.setStatus(TripStatus.PRIVATE);
        return mapper.map(tripRepository.save(trip), TripGeneralDTO.class);
    }

    public int getGuestId() {
        List<ServiceInstance> instances = discoveryClient.getInstances("user-service");
        ServiceInstance instance = instances.get(0);
        return restTemplateClient
                .restTemplate()
                .getForObject(
                        instance.getUri() + "/user/api/user/get-guest-id",
                        Integer.class
                );
    }

    public List<TripGeneralDTO> getLast3TripsByGuest(int[] array) {
        List<TripGeneralDTO> tripGeneralDTOS = new ArrayList<>();
        int count = 0;
        for (int j : array) {
            if(count >=3) break;
            Optional<Trip> trip = tripRepository.getTripById(j);
            if(!trip.isEmpty()) {
                TripGeneralDTO dto = mapper.map(trip.get(), TripGeneralDTO.class);
                dto.setImage(getFirstPOIImage(dto.getTripId()));
                tripGeneralDTOS.add(dto);
                count ++;
            }
        }
        return tripGeneralDTOS;
    }
    public void setTripsPostLogin(int [] tripIds, int user){
        for (int j : tripIds) {
            tripRepository.updateTripUser(j, user);
        }
    }
}
