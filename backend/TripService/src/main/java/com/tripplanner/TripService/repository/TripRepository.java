package com.tripplanner.TripService.repository;

import com.tripplanner.TripService.entity.Trip;

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
    @Query("select t from Trip t where t.tripId = :id")
    Trip findById(int id);
    @Query("select t from Trip t where t.user = :id and t.status <>'DELETED' order by t.dateModified desc")
    ArrayList<Trip> getTripsByUser(int id);
    @Modifying
    @Query("update Trip t set t.status = 'DELETED' where t.tripId = :id")
    void deleteTripById(int id);
    @Query(value = "select * from Trip t where t.user_id = :id and t.status <>'DELETED' order by t.date_modified desc limit 3", nativeQuery = true)
    ArrayList<Trip> getLast3TripsByUser(int id);
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.user = :id and t.status <>'DELETED'")
    int getNumberOfTripsByUser(int id);
    @Modifying
    @Query(
            value = "INSERT INTO trip (date_created, date_modified, status, budget, name, user_id, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            nativeQuery = true)
    void createEmptyTrip(Date dateCreated, Date dateModified, String status, double budget, String name, int userId, Date startDate, Date endDate);

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


    @Modifying
    @Transactional
    @Query(value = "insert into trip_details (day_number,end_time,note,start_time,master_activity_id,trip_id) value(?1,?2,?3,?4,?5,?6)",nativeQuery = true)
    public void insertTripDetails(int day, int end, String note, int start, int poi, int trip);

    @Query(value = "SELECT u.optimizer_request_id FROM user u where u.user_id=?1",nativeQuery = true)
    Integer getStatusGenerating(int userId);

    @Query(value="Update `user`  set optimizer_request_id= ?1 where user_id=?2",nativeQuery = true)
    void changeInProgress(int id,int userId);

    @Query(value = "Insert into optimize_request ('status','instance_uri','trip_id','user_id') value(?1,?2,null,?3)",nativeQuery = true)
    void insertRequest(String status,String uri,int userId);

}
