package com.tripplanner.TripService.repository;

import com.tripplanner.TripService.entity.Trip;
import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface TripRepository extends JpaRepository<Trip, Integer> {
  @Query("select t from Trip t where t.tripId = :id and t.status  <>'DELETED'")
  Optional<Trip> getTripById(int id);

  @Query("select t from Trip t where t.tripId = :id ")
  Trip findById(int id);

  @Query(
    "select t from Trip t where t.user = :id and t.status <>'DELETED' order by t.dateModified desc"
  )
  ArrayList<Trip> getTripsByUser(int id);

  @Modifying
  @Query("update Trip t set t.status = 'DELETED' where t.tripId = :id")
  void deleteTripById(int id);

  @Query(
    value = "select * from Trip t where t.user_id = :id and t.status <>'DELETED' order by t.date_modified desc limit 3",
    nativeQuery = true
  )
  ArrayList<Trip> getLast3TripsByUser(int id);

  @Query(
    "SELECT COUNT(t) FROM Trip t WHERE t.user = :id and t.status <>'DELETED'"
  )
  int getNumberOfTripsByUser(int id);

  @Modifying
  @Query(
    value = "INSERT INTO trip (date_created, date_modified, status, budget, name, user_id, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
    nativeQuery = true
  )
  void createEmptyTrip(
    Date dateCreated,
    Date dateModified,
    String status,
    double budget,
    String name,
    int userId,
    Date startDate,
    Date endDate
  );

  @Query(value = "select MAX(trip_id) from trip", nativeQuery = true)
  int getNewestTripId();

  @Query(
    value = "SELECT user_id FROM trip WHERE trip_id = ?1",
    nativeQuery = true
  )
  int getTripUserId(int tripId);

  @Modifying
  @org.springframework.transaction.annotation.Transactional
  @Query("UPDATE Trip t SET t.name=:name WHERE t.tripId=:tripId")
  void updateTripName(int tripId, String name);

  @Modifying
  @org.springframework.transaction.annotation.Transactional
  @Query(
    "UPDATE Trip t SET t.startDate=:startDate, t.endDate=:endDate WHERE t.tripId=:tripId"
  )
  void updateStartAndEndDates(int tripId, Date startDate, Date endDate);

  @Modifying
  @Transactional
  @Query(
    value = "insert into trip_details (day_number,end_time,note,start_time,master_activity_id,trip_id) value(?1,?2,?3,?4,?5,?6)",
    nativeQuery = true
  )
  void insertTripDetails(
    int day,
    int end,
    String note,
    int start,
    int poi,
    int trip
  );

  @Query(
    value = "select * from trip where trip_id = :id and ((status = 'PUBLIC') or (user_id = :userId and status = 'PRIVATE'))",
    nativeQuery = true
  )
  Trip findDetailedTripById(int id, int userId);

  @Query(
    value = "SELECT u.optimizer_request_id FROM user u where u.user_id=?1",
    nativeQuery = true
  )
  Integer getStatusGenerating(int userId);

  @Query(
    value = "Update `user`  set optimizer_request_id= ?1 where user_id=?2",
    nativeQuery = true
  )
  void changeInProgress(int id, int userId);

  @Query(
    value = "Insert into optimize_request ('status','instance_uri','trip_id','user_id') value(?1,?2,null,?3)",
    nativeQuery = true
  )
  void insertRequest(String status, String uri, int userId);

  @Query(
    value = "select distinct t.trip_id, t.*" +
    " from trip t left join trip_details td on t.trip_id = td.trip_id left join poi p on td.master_activity_id = p.activity_id left join poi_destination pd on p.activity_id = pd.poi_id left join destination d on pd.destination_id = d.destination_id " +
    "where t.status = 'PUBLIC' " +
    "and cast(t.date_created as date) >= :earliest  " +
    "and (t.name like CONCAT('%',:name,'%') or d.name like CONCAT('%',:name,'%')) " +
    "and datediff(t.end_date,t.start_date)+1 >= :minDays " +
    "and datediff(t.end_date,t.start_date)+1 <= (case when :maxDays < :minDays  then 100 else :maxDays end)" +
    "order by t.date_created desc limit :limit offset :offset",
    nativeQuery = true
  )
  ArrayList<Trip> getPublicTrips(
    int offset,
    int limit,
    String name,
    int minDays,
    int maxDays,
    Date earliest
  );

  @Query(
    value = "select count(distinct t.trip_id) as count" +
    " from trip t left join trip_details td on t.trip_id = td.trip_id left join poi p on td.master_activity_id = p.activity_id left join poi_destination pd on p.activity_id = pd.poi_id left join destination d on pd.destination_id = d.destination_id " +
    "where t.status = 'PUBLIC' " +
    "and cast(t.date_created as date) >= :earliest " +
    "and (t.name like CONCAT('%',:name,'%') or d.name like CONCAT('%',:name,'%')) " +
    "and datediff(t.end_date,t.start_date)+1 >= :minDays " +
    "and datediff(t.end_date,t.start_date)+1 <= (case when :maxDays < :minDays  then 100 else :maxDays end)",
    nativeQuery = true
  )
  int getPublicTripsCount(String name, int minDays, int maxDays, Date earliest);

  @Modifying
  @Transactional
  @Query(
    value = "update trip set status = :status where trip_id = :tripId",
    nativeQuery = true
  )
  void toggleStatus(int tripId, String status);

  @Query(
    value = "select distinct d.name from trip_details td left join poi p on td.master_activity_id = p.activity_id left join poi_destination pd on p.activity_id = pd.poi_id left join destination d on pd.destination_id = d.destination_id where td.trip_id=:tripId",
    nativeQuery = true
  )
  ArrayList<String> getDestinationsOfTrip(int tripId);

  @Query(
    value = "select distinct ma.name from trip_details td " +
    "left join poi p on td.master_activity_id = p.activity_id " +
    "left join master_activity ma on p.activity_id = ma.activity_id " +
    "where td.trip_id = :tripId and ma.activity_id is not null limit :limit",
    nativeQuery = true
  )
  ArrayList<String> getPOIsByTripId(int tripId, int limit);

  @Modifying
  @org.springframework.transaction.annotation.Transactional
  @Query("UPDATE Trip t SET t.budget=:budget WHERE t.tripId=:tripId")
  void updateTripBudget(int tripId, Double budget);

  @Modifying
  @org.springframework.transaction.annotation.Transactional
  @Query("UPDATE Trip t SET t.user=:userId WHERE t.tripId=:tripId")
  void updateTripUser(int tripId, int userId);
}
