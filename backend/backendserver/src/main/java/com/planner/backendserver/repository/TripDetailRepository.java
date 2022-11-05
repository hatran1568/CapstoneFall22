package com.planner.backendserver.repository;

import com.planner.backendserver.entity.TripDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
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
    @Query(value="select * from trip_details td where td.trip_id = :tripId order by td.trip_details_id asc limit 1",nativeQuery=true)
    TripDetails findFirstInTrip(int tripId);

    @Query("select td from TripDetails td where td.trip.tripId = :tripId")
    ArrayList<TripDetails> getListByTripId(int tripId);
    @Modifying
    @Transactional
    @Query(value = "delete from trip_details where trip_id=:tripId and date < :startDate or date > :endDate", nativeQuery = true)
    void deleteByRange(int tripId, Date startDate, Date endDate);
}
