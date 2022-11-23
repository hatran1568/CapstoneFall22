package com.example.TripService.service.interfaces;


import com.example.TripService.dto.response.DetailedTripDTO;
import com.example.TripService.dto.response.TripDetailDTO;
import com.example.TripService.dto.response.TripGeneralDTO;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
@Service
public interface TripService {
    public DetailedTripDTO getDetailedTripById(int id);
    public TripGeneralDTO getTripGeneralById(int id);
    public TripDetailDTO addTripDetail(Date date, int startTime, int endTime, int activityId, int tripId, String note);
    public TripDetailDTO addCustomTripDetail(Date date, int startTime, int endTime, int tripId, String name, String address);
    public void deleteDetailById(int id);
    public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);
    public TripDetailDTO getTripDetailById(int id);
    public TripDetailDTO editTripDetailById(TripDetailDTO detail, int id);
    public TripDetailDTO editCustomTripDetailById(TripDetailDTO detail, int detailId, int tripId);
    public List<TripGeneralDTO> getTripsByUser(int userId);
    public void deleteTripById(int id);
    public List<TripGeneralDTO> getLast3TripsByUser(int userId);
    public int countTripByUser(int userId);
    public void editTripName(int tripId, String name);
    public boolean tripExists(int tripId);
    public void editStartAndEndDates(int tripId, Date startDate, Date endDate);
    public List<TripDetailDTO> getTripDetailsToBeDeleted(int tripId, int numberOfDays);
    TripGeneralDTO cloneTrip(int userId, int tripId, Date startDate);
    public Integer addTripDetailGenerated(int day, int startTime, int endTime, int activityId, int tripId, String note);
    public void insertExpense(double amount,String description, int trip_id,int details);
}
