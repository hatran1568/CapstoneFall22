package com.example.Optimizer.repository;

import com.example.Optimizer.entity.Trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;


@Repository
@Transactional
public interface TripRepository extends JpaRepository<Trip, Integer> {

}
