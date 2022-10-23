package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Optional;
@Service
public interface TripService {
    public Optional<Trip> getTripById(int id);
    public TripDetails addTripDetail(Date date, int startTime, int endTime, int activityId, int tripId);
    public void deleteDetailById(int id);
    public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);
    public Optional<TripDetails> getTripDetailById(int id);
    public Optional<TripDetails> editTripDetailById(TripDetails detail, int id);
    public Optional<ArrayList<TripGeneralDTO>> getTripsByUser(int userId);
}
