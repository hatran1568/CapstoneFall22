package com.planner.backendserver.service.implementers;

import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import com.planner.backendserver.repository.TripDetailRepository;
import com.planner.backendserver.repository.TripRepository;
import com.planner.backendserver.service.interfaces.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Optional;
@Service
public class TripServiceImpl implements TripService {
    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private TripDetailRepository tripDetailRepository;

    @Override
    public Optional<Trip> getTripById(int id) {
        return tripRepository.getTripById(id);
    }

    @Override
    public TripDetails addTripDetail(TripDetails tripDetail) {
        return tripDetailRepository.save(tripDetail);
    }

    @Override
    public void deleteDetailById(int id) {
        tripDetailRepository.deleteById(id);
    }


}
