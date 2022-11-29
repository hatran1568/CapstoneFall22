package com.tripplanner.LocationService.repository;


import com.tripplanner.LocationService.entity.Distance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DistanceRepository extends JpaRepository<Distance,Integer> {
    @Query("SELECT p.distance from Distance p where p.startStation.activityId = :srcId and p.endStation.activityId=:destId")
    public double getDistanceBySrcAndDest(int srcId,int destId);

    @Modifying
    @Query(value = "insert into distance(distance,src_poi,dest_poi) values (?1,?2,?3)",nativeQuery = true)
    public void insertDistance(double distance,int srcID,int destID);
}
