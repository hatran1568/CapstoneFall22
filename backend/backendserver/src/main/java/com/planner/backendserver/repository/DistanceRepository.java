package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Distance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DistanceRepository extends JpaRepository<Distance,Integer> {
    @Query("SELECT p.distance from Distance p where p.startStation.activityId = :srcId and p.endStation.activityId=:destId")
    public double getDistanceBySrcAndDest(int srcId,int destId);
}
