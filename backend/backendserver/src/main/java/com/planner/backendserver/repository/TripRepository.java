package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.response.PublicTripDTO;
import com.planner.backendserver.entity.Trip;
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
    @Query("select t from Trip t where t.tripId = :id and ((t.status = 'PUBLIC') or (t.user.userID = :userId and t.status = 'PRIVATE'))")
    Trip findDetailedTripById(int id, int userId);
    @Query("select t from Trip t where t.tripId = :id")
    Trip findById(int id);
    @Query("select t from Trip t where t.user.userID = :id and t.status <>'DELETED' order by t.dateModified desc")
    ArrayList<Trip> getTripsByUser(int id);
    @Modifying
    @Query("update Trip t set t.status = 'DELETED' where t.tripId = :id")
    void deleteTripById(int id);
    @Query(value = "select * from Trip t where t.user_id = :id and t.status <>'DELETED' order by t.date_modified desc limit 3", nativeQuery = true)
    ArrayList<Trip> getLast3TripsByUser(int id);
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.user.userID = :id and t.status <>'DELETED'")
    int getNumberOfTripsByUser(int id);
    @Modifying
    @Query(
            value = "INSERT INTO trip (date_created, date_modified, status, budget, `name`, user_id, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
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
    @Transactional
    @Query("UPDATE Trip t SET t.name=:name WHERE t.tripId=:tripId")
    public void updateTripName(int tripId, String name);
    @Modifying
    @Transactional
    @Query("UPDATE Trip t SET t.startDate=:startDate, t.endDate=:endDate WHERE t.tripId=:tripId")
    public void updateStartAndEndDates(int tripId, Date startDate, Date endDate);
    @Query(value = "select * from trip t where t.status='PUBLIC' and t.name like CONCAT('%',:name,'%') order by t.date_created desc limit :limit offset :offset", nativeQuery = true)
    public ArrayList<Trip> getPublicTrips(int offset, int limit, String name);
//    public ArrayList<Trip> getPublicTripsByName(String search, int offset, int limit);
@Query(value = "select count(distinct t.trip_id) as count" +
        " from trip t left join trip_details td on t.trip_id = td.trip_id left join poi p on td.master_activity_id = p.activity_id left join poi_destination pd on p.activity_id = pd.poi_id left join destination d on pd.destination_id = d.destination_id " +
        "where t.status = 'PUBLIC' " +
        "and cast(t.date_created as date) >= :earliest " +
        "and (t.name like CONCAT('%',:name,'%') or d.name like CONCAT('%',:name,'%')) " +
        "and datediff(t.end_date,t.start_date)+1 >= :minDays " +
        "and datediff(t.end_date,t.start_date)+1 <= (case when :maxDays < :minDays  then 100 else :maxDays end)", nativeQuery = true)
    public int getPublicTripsCount(String name, int minDays, int maxDays, Date earliest);
//    @Query(value = "select distinct t.trip_id as tripId, t.start_date as startDate, t.end_date as endDate, t.name as name, t.date_created as dateCreated, t.status as status, t.user_id as userID " +
@Query(value = "select distinct t.trip_id, t.*" +
            " from trip t left join trip_details td on t.trip_id = td.trip_id left join poi p on td.master_activity_id = p.activity_id left join poi_destination pd on p.activity_id = pd.poi_id left join destination d on pd.destination_id = d.destination_id " +
        "where t.status = 'PUBLIC' " +
        "and cast(t.date_created as date) >= :earliest  " +
        "and (t.name like CONCAT('%',:name,'%') or d.name like CONCAT('%',:name,'%')) " +
        "and datediff(t.end_date,t.start_date)+1 >= :minDays " +
        "and datediff(t.end_date,t.start_date)+1 <= (case when :maxDays < :minDays  then 100 else :maxDays end)" +
        "order by t.date_created desc limit :limit offset :offset", nativeQuery = true)
    public ArrayList<Trip> getPublicTripsWithSearch(int offset, int limit, String name, int minDays, int maxDays, Date earliest);
}
