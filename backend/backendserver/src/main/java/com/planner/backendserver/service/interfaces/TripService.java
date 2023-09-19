package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.ChecklistItemDTO;
import com.planner.backendserver.DTO.response.DetailedTripDTO;
import com.planner.backendserver.DTO.response.PublicTripDTO;
import com.planner.backendserver.DTO.response.TripDetailDTO;
import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.ChecklistItem;
import com.planner.backendserver.entity.TripDetails;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public interface TripService {
  public DetailedTripDTO getDetailedTripById(int tripId, int userId);

  public TripGeneralDTO getTripGeneralById(int id);

  public TripDetailDTO addTripDetail(
    Date date,
    int startTime,
    int endTime,
    int activityId,
    int tripId,
    String note
  );

  public TripDetailDTO addCustomTripDetail(
    Date date,
    int startTime,
    int endTime,
    int tripId,
    String name,
    String address,
    String note
  );

  public void deleteDetailById(int id);

  public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);

  public TripDetailDTO getTripDetailById(int id);

  public TripDetailDTO editTripDetailById(TripDetailDTO detail, int id);

  public TripDetailDTO editCustomTripDetailById(
    TripDetailDTO detail,
    int detailId,
    int tripId
  );

  public List<TripGeneralDTO> getTripsByUser(int userId);

  public void deleteTripById(int id);

  public List<TripGeneralDTO> getLast3TripsByUser(int userId);

  public int countTripByUser(int userId);

  public void editTripName(int tripId, String name);

  public boolean tripExists(int tripId);

  public void editStartAndEndDates(int tripId, Date startDate, Date endDate);

  public List<TripDetailDTO> getTripDetailsToBeDeleted(
    int tripId,
    int numberOfDays
  );

  TripGeneralDTO cloneTrip(int userId, int tripId, Date startDate);
  int countPublicTrips(String search, int minDays, int maxDays, Date earliest);
  ArrayList<PublicTripDTO> getPublicTrips(
    int page,
    int pageSize,
    String search,
    int minDays,
    int maxDays,
    Date earliest
  );
}
