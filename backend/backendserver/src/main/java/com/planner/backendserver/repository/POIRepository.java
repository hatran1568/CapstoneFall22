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

public interface POIRepository extends JpaRepository<POI, Integer> {
    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :id")
    MasterActivity getPOIByActivityId(int id);

    @Query("select d.distance from Distance d where d.startStation.activityId = :from and d.endStation.activityId = :to")
    Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);

    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.name like  CONCAT(:keyword,'%')")
    ArrayList<POI> findPOISByKeyword(String keyword);

    @Query("SELECT COUNT(p.activityId) FROM POI p join Rating r on p.activityId=r.POI.activityId GROUP BY p.activityId HAVING p.activityId=:id")
    public Optional<Integer> getNumberOfRateByActivityId(int id);

    @Query(value = "SELECT pi.image_id  from poi p join poi_image pi on p.activity_id=pi.poi_id  where p.activity_id=:id limit 1",nativeQuery = true)
    public String getThumbnailById(int id);
}
