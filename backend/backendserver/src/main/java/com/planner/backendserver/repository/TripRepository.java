package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    @Query("select t from Trip t where t.tripId = :id")
    Trip findById(int id);
    @Query("select t from Trip t where t.user.userID = :id and t.status = 'PUBLIC' or t.status = 'PRIVATE' order by t.dateModified desc")
    ArrayList<Trip> getTripsByUser(int id);
    @Modifying
    @Query("update Trip t set t.status = 'DELETED' where t.tripId = :id")
    void deleteTripById(int id);
    @Query(value = "select * from Trip t where t.user_id = :id and t.status = 'PUBLIC' or t.status = 'PRIVATE' order by t.date_modified desc limit 3", nativeQuery = true)
    ArrayList<Trip> getLast3TripsByUser(int id);
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.user.userID = :id and t.status = 'PUBLIC' or t.status = 'PRIVATE'")
    int getNumberOfTripsByUser(int id);
    @Modifying
    @Query(
            value = "INSERT INTO trip (date_created, date_modified, is_deleted, budget, `name`, user_id, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            nativeQuery = true)
    void createEmptyTrip(Date dateCreated, Date dateModified, boolean isDeleted, double budget, String name, int userId, Date startDate, Date endDate);

    @Query(
            value = "select MAX(trip_id) from trip",
            nativeQuery = true)
    int getNewestTripId();
    @Query(
            value = "SELECT user_id FROM trip WHERE trip_id = ?1",
            nativeQuery = true)
    int getTripUserId(int tripId);

    @Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Trip t SET t.name=:name WHERE t.tripId=:tripId")
    public void updateTripName(int tripId, String name);
    @Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Trip t SET t.startDate=:startDate, t.endDate=:endDate WHERE t.tripId=:tripId")
    public void updateStartAndEndDates(int tripId, Date startDate, Date endDate);
}
