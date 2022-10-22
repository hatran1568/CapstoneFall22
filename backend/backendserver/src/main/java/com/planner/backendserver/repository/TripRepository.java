package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.GalleryImages;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;


@Repository
@Transactional
public interface TripRepository extends JpaRepository<Trip, Integer> {
    @Query("select t from Trip t where t.tripId = :id")
    Optional<Trip> getTripById(int id);
    ArrayList<Trip> getTripsByUser(String email);

    @Modifying
    @Query(
            value = "INSERT INTO trip (date_created, date_modified, is_deleted, budget, `name`, user_id, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            nativeQuery = true)
    void createEmptyTrip(Date dateCreated, Date dateModified, boolean isDeleted, double budget, String name, int userId, Date startDate, Date endDate);

    @Query(
            value = "select MAX(trip_id) from trip",
            nativeQuery = true)
    int getNewestTripId();
}
