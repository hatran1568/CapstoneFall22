package com.planner.backendserver.service.implementers;

import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.*;
import com.planner.backendserver.repository.*;
import com.planner.backendserver.service.interfaces.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {
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

    @Override
    public Optional<Trip> getTripById(int id) {
        return tripRepository.getTripById(id);
    }

    @Override
    public TripDetails addTripDetail(Date date, int startTime, int endTime, int activityId, int tripId) {
        TripDetails tripDetails = new TripDetails();
        tripDetails.setDate(date);
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setActivityId(activityId);
        tripDetails.setMasterActivity(masterActivity);
        Trip trip = new Trip();
        trip.setTripId(tripId);
        tripDetails.setTrip(trip);
        TripDetails saved = tripDetailRepository.save(tripDetails);
        saved.setMasterActivity(masterActivityRepository.getMasterActivityByActivityId(saved.getMasterActivity().getActivityId()));
        return saved;
    }

    @Override
    public TripDetails addCustomTripDetail(Date date, int startTime, int endTime, int tripId, String name, String address) {
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setName(name);
        masterActivity.setAddress(address);
        masterActivity = masterActivityRepository.save(masterActivity);
        CustomActivity customActivity = new CustomActivity();
        customActivityRepository.save(customActivity);
        customActivity.setActivityId(masterActivity.getActivityId());
        TripDetails tripDetails = new TripDetails();
        tripDetails.setDate(date);
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);

        Trip trip = new Trip();
        trip.setTripId(tripId);
        tripDetails.setTrip(trip);
        TripDetails saved = tripDetailRepository.save(tripDetails);
        saved.setMasterActivity(masterActivity);
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
    public Optional<TripDetails> getTripDetailById(int id) {
        return tripDetailRepository.getTripDetailsById(id);
    }

    @Override
    public Optional<TripDetails> editTripDetailById(TripDetails newDetail, int id) {
        return Optional.ofNullable(tripDetailRepository.findById(id)
                .map(detail -> {
                    detail.setDate(newDetail.getDate());
                    detail.setStartTime(newDetail.getStartTime());
                    detail.setEndTime(newDetail.getEndTime());
                    return tripDetailRepository.save(detail);
                })
                .orElseGet(() -> {
                    return tripDetailRepository.save(newDetail);
                }));
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
            tripDTO.setImage(getTripThumbnail(trip.getTripId()));
            tripDTO.setDateModified(trip.getDateModified());
            return tripDTO;
        }).collect(Collectors.toList());

    }

    private String getTripThumbnail(int tripId){
        List<TripDetails> tripDetails = tripRepository.getTripById(tripId).get().getListTripDetails();
        if (tripDetails.size() == 0){
            return null;
        }
        int masterActivityId = tripDetails.get(0).getMasterActivity().getActivityId();
        Optional<POI> poi = poiRepository.getPOIByMasterActivity(masterActivityId);
        if (poi.isPresent()){
            if (poi.get().getImages().size() > 0)
            return poi.get().getImages().get(0).getUrl();
        }
        return null;
    }
}
