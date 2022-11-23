package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.response.*;
import com.planner.backendserver.service.interfaces.TripService;
import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.*;
import com.planner.backendserver.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    private MasterActivityRepository masterActivityRepository;
    @Autowired
    private POIRepository poiRepository;
    @Autowired
    private CustomActivityRepository customActivityRepository;
    @Autowired
    private POIImageRepository poiImageRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;
    @Override
    public DetailedTripDTO getDetailedTripById(int tripId) {
        Trip trip = tripRepository.findById(tripId);
        if(trip == null) return null;
        DetailedTripDTO tripDetailedDTO = mapper.map(trip, DetailedTripDTO.class);
        tripDetailedDTO.setListTripDetails(getListTripDetailDTO(trip));
        return tripDetailedDTO;
    }
    public ArrayList<TripDetailDTO> getListTripDetailDTO(Trip trip){
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getListByTripId(trip.getTripId());
        Date startDate = (Date) trip.getStartDate();
        ArrayList<TripDetailDTO> tripDetailDTOS = new ArrayList<>();
        for (TripDetails tripDetail: tripDetails) {
            TripDetailDTO tripDetailDTO = mapper.map(tripDetail, TripDetailDTO.class);
            MasterActivityDTO masterActivityDTO = tripDetailDTO.getMasterActivity();
            tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityDTO.getActivityId()));
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
        User user = new User();
        user.setUserID(userId);
        Trip newTrip = new Trip();
        int numberOfDays = getDayNumberByFromStartDate((Date) originalTrip.getStartDate(), (Date) originalTrip.getEndDate());
        Date endDate = getDateByStartDateAndDayNumber(startDate, numberOfDays);
        newTrip.setUser(user);
        newTrip.setStartDate(startDate);
        newTrip.setEndDate(endDate);
        newTrip.setName(originalTrip.getName());
        newTrip.setBudget(originalTrip.getBudget());
        Date now = new Date(Calendar.getInstance().getTime().getTime());
        newTrip.setDateCreated(now);
        newTrip.setDateModified(now);
        newTrip.setStatus(TripStatus.PRIVATE);
        TripGeneralDTO saved = mapper.map(tripRepository.save(newTrip), TripGeneralDTO.class);
        cloneTripDetails(tripId, saved.getTripId());
        return saved;
    }
    private void cloneTripDetails(int tripId, int newTripId){
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getListByTripId(tripId);
        Trip newTrip = new Trip();
        newTrip.setTripId(newTripId);
        for (TripDetails detail:tripDetails) {
            TripDetails newDetail = new TripDetails();

            MasterActivity masterActivity = detail.getMasterActivity();
            int activityId = masterActivity.getActivityId();
            if(customActivityRepository.existsById(activityId)){
               newDetail.setMasterActivity(addCustomActivity(masterActivity.getName(), masterActivity.getAddress()));
            } else newDetail.setMasterActivity(masterActivity);
            newDetail.setTrip(newTrip);
            newDetail.setNote(detail.getNote());
            newDetail.setDayNumber(detail.getDayNumber());
            newDetail.setStartTime(detail.getStartTime());
            newDetail.setEndTime(detail.getEndTime());

            tripDetailRepository.save(newDetail);
            if(poiRepository.existsById(activityId)) addPOICostToExpenses(newTripId, activityId);
        }
    }
    @Override
    public TripDetailDTO addTripDetail(Date date, int startTime, int endTime, int activityId, int tripId, String note) {
        Trip trip = tripRepository.findById(tripId);
        TripDetails tripDetails = new TripDetails();
        tripDetails.setDayNumber(getDayNumberByFromStartDate((Date) trip.getStartDate(), date));
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setActivityId(activityId);
        tripDetails.setMasterActivity(masterActivity);
        tripDetails.setTrip(trip);
        tripDetails.setNote(note);
        TripDetailDTO saved = mapper.map(tripDetailRepository.save(tripDetails), TripDetailDTO.class);
        addPOICostToExpenses(tripId, activityId);
        saved.setMasterActivity(getMasterActivity(saved.getMasterActivity().getActivityId()));
        saved.setDate(date);
        return saved;
    }

    //add an expense to trip with typical price of POI
    public void addPOICostToExpenses(int tripId, int activityId){
        POI poi = poiRepository.getById(activityId);
        ExpenseCategory expenseCategory = expenseCategoryRepository.findByName("Activities");
        if(expenseCategory == null) return;
        if(poi.getTypicalPrice() > 0){
            expenseRepository.addExpense(poi.getTypicalPrice(), poi.getName(), expenseCategory.getExpenseCategoryId(), tripId);
        }
    }
    public MasterActivityDTO getMasterActivity(int id){
        if(!masterActivityRepository.existsById(id)) return null;
        MasterActivityDTO masterActivityDTO = mapper.map(masterActivityRepository.getById(id), MasterActivityDTO.class);
        if(poiRepository.existsById(masterActivityDTO.getActivityId())){
            POIDTO poidto = mapper.map(poiRepository.getPOIByActivityId(masterActivityDTO.getActivityId()), POIDTO.class);
            ArrayList<POIImage> listImages = new ArrayList<>();
            POIImage poiImage = poiImageRepository.findFirstByPoiId(poidto.getActivityId());
            if(poiImage != null) listImages.add(poiImage);
            poidto.setImages(listImages);
            poidto.setCustom(false);
            return poidto;
        }else{
            masterActivityDTO.setCustom(true);
            return masterActivityDTO;
        }
    }
    private CustomActivity addCustomActivity(String name, String address){
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setName(name);
        masterActivity.setAddress(address);
        MasterActivity savedMasterActivity = masterActivityRepository.save(masterActivity);
        CustomActivity customActivity = new CustomActivity();
        customActivity.setActivityId(savedMasterActivity.getActivityId());
        return customActivityRepository.save(customActivity);
    }
    @Override
    public TripDetailDTO addCustomTripDetail(Date date, int startTime, int endTime, int tripId, String name, String address) {
        Trip trip = tripRepository.findById(tripId);
        CustomActivity customActivity = addCustomActivity(name, address);

        TripDetails tripDetails = new TripDetails();
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);
        tripDetails.setMasterActivity(customActivity);
        tripDetails.setDayNumber(getDayNumberByFromStartDate((Date) trip.getStartDate(), date));

        MasterActivityDTO masterActivityDTO = mapper.map(customActivity, MasterActivityDTO.class);
        masterActivityDTO.setCustom(true);

        tripDetails.setTrip(trip);
        TripDetailDTO saved = mapper.map(tripDetailRepository.save(tripDetails), TripDetailDTO.class);
        saved.setMasterActivity(masterActivityDTO);
        saved.setDate(date);
        return saved;
    }

    @Override
    public void deleteDetailById(int id) {
        tripDetailRepository.deleteById(id);
    }

    @Override
    public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to) {
        return poiRepository.getDistanceBetweenTwoPOIs(from, to);
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
        masterActivityRepository.findById(maId)
                .map(activity -> {
                    activity.setName(masterActivity.getName());
                    activity.setAddress(masterActivity.getAddress());
                    return masterActivityRepository.save(activity);

                }).orElseGet(() -> null);
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
    private String getTripThumbnail(List<TripDetails> tripDetails) {
        if (tripDetails.size() == 0) {
            return null;
        }
        int masterActivityId = tripDetails.get(0).getMasterActivity().getActivityId();
        Optional<POI> poi = poiRepository.getPOIByMasterActivity(masterActivityId);
        if (poi.isPresent()) {
            ArrayList<POIImage> poiImages = poiImageRepository.findAllByPOIId(poi.get().getActivityId());
            if (poiImages.size() > 0)
                return poiImages.get(0).getUrl();
        }
        return null;
    }

    private String getFirstPOIImage(int tripId) {
        TripDetails tripDetails = tripDetailRepository.findFirstInTrip(tripId);
        if (tripDetails == null) return null;
        POIImage poiImage = poiImageRepository.findFirstByPoiId(tripDetails.getMasterActivity().getActivityId());
        if (poiImage == null) return null;
        return poiImage.getUrl();
    }
}
