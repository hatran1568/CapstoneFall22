package com.tripplanner.TripService.repository;


import com.tripplanner.TripService.dto.response.TripDetailsQueryDTO;
import com.tripplanner.TripService.entity.TripDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

public interface TripDetailRepository extends JpaRepository<TripDetails, Integer> {
    @Override
    TripDetails save(TripDetails tripDetails);

    @Override
    void deleteById(Integer integer);

    @Query("select td from TripDetails td where td.tripDetailsId = :id")
    TripDetails getTripDetailsById(int id);

    @Override
    Optional<TripDetails> findById(Integer id);

    @Query(value = "select * from trip_details td where td.trip_id = :tripId order by td.trip_details_id asc limit 1", nativeQuery = true)
    TripDetails findFirstInTrip(int tripId);

    @Query("select td from TripDetails td where td.trip.tripId = :tripId")
    ArrayList<TripDetails> getListByTripId(int tripId);

    @Modifying
    @Transactional
    @Query(value = "delete from trip_details where trip_id=:tripId and day_number > :numberOfDays", nativeQuery = true)
    void deleteByRange(int tripId, int numberOfDays);

    @Query(value = "select * from trip_details where trip_id=:tripId and day_number > :numberOfDays order by day_number asc limit 5", nativeQuery = true)
    ArrayList<TripDetails> getTripDetailsOutOfRange(int tripId, int numberOfDays);

    @Query(value = "select MAX(trip_details_id) from trip_details",
            nativeQuery = true)
    int getLatestTripDetails();

    @Query(value =
            "SELECT td.trip_details_id as detailsId," +
                    " td.day_number as dayNumber," +
                    " td.start_time as startTime," +
                    " td.note as note," +
                    " td.end_time as endTime," +
                    " td.master_activity_id as masterActivity," +
                    " td.trip_id as tripId " +
                    "FROM trip_details td join trip t on t.trip_id = td.trip_id where t.trip_id=?1",
            nativeQuery = true)
    ArrayList<TripDetailsQueryDTO> getTripDetailsByTrip(int id);
}
