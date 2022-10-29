package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.TripDetailedDTO;
import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
@Service
public interface TripService {
    public TripDetailedDTO getTripDetailedById(int id);
    public TripGeneralDTO getTripGeneralById(int id);
    public TripDetails addTripDetail(Date date, int startTime, int endTime, int activityId, int tripId);
    public TripDetails addCustomTripDetail(Date date, int startTime, int endTime, int tripId, String name, String address);
    public void deleteDetailById(int id);
    public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);
    public Optional<TripDetails> getTripDetailById(int id);
    public Optional<TripDetails> editTripDetailById(TripDetails detail, int id);
    public Optional<TripDetails> editCustomTripDetailById(TripDetails detail, int id);
    public List<TripGeneralDTO> getTripsByUser(int userId);
    public void deleteTripById(int id);
    public List<TripGeneralDTO> getLast3TripsByUser(int userId);
    public int countTripByUser(int userId);
}
