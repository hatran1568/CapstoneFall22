package com.example.Optimizer.repository;

import com.example.Optimizer.entity.Destination;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepository extends JpaRepository<Destination,Integer> {
    public Destination findByDestinationId(int id);

}
