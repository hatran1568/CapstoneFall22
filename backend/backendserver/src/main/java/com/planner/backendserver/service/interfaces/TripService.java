package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.sql.Date;
import java.util.Optional;
@Service
public interface TripService {
    public Optional<Trip> getTripById(int id);
    public TripDetails addTripDetail(TripDetails tripDetail);
    public void deleteDetailById(int id);
}
