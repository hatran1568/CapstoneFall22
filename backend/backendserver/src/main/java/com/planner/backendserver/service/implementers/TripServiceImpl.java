package com.planner.backendserver.service.implementers;

import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import com.planner.backendserver.repository.MasterActivityRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.repository.TripDetailRepository;
import com.planner.backendserver.repository.TripRepository;
import com.planner.backendserver.service.interfaces.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Optional;
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
    public Optional<ArrayList<TripGeneralDTO>> getTripsByUser(int userId) {
        return Optional.empty();
    }


}
