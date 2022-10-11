package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.entity.TripDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Optional;


@Repository
public interface TripRepository extends JpaRepository<Trip, Integer> {
    @Query("select t from Trip t where t.tripId = :id")
    Optional<Trip> getTripById(int id);
    ArrayList<Trip> getTripsByUser(String email);


}
