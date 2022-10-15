package com.planner.backendserver.repository;

import com.planner.backendserver.entity.TripDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;

public interface TripDetailRepository extends JpaRepository<TripDetails, Integer> {
    @Override
    TripDetails save(TripDetails tripDetails);

    @Override
    void deleteById(Integer integer);
    @Override
    TripDetails getById(Integer integer);
}
