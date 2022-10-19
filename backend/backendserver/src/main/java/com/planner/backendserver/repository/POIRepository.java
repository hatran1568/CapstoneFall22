package com.planner.backendserver.repository;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository

public interface POIRepository extends JpaRepository<POI,Integer> {
    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :id")
    MasterActivity getPOIByActivityId(int id);
    @Query("select d.distance from Distance d where d.startStation.activityId = :from and d.endStation.activityId =:to")
    Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);
    @Query("SELECT p from POI p where p.name like  CONCAT('%',:keyword,'%')")
    public ArrayList<POI> findPOISByKeyword(String keyword);
}
