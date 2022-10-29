package com.example.Optimizer.repository;

import com.example.Optimizer.entity.TripDetails;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TripDetailRepository extends JpaRepository<TripDetails, Integer> {
    @Override
    TripDetails save(TripDetails tripDetails);


}
