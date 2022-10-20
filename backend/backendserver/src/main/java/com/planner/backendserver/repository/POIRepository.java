package com.planner.backendserver.repository;

import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository

public interface POIRepository extends JpaRepository<POI,Integer> {
    @Query("SELECT p from POI p where p.name like  CONCAT('%',:keyword,'%')")
    public ArrayList<POI> findPOISByKeyword(String keyword);

    @Query("SELECT COUNT(p.activityId) FROM POI p join Rating r on p.activityId=r.POI.activityId GROUP BY p.activityId HAVING p.activityId=:id")
    public Optional<Integer> getNumberOfRateByActivityId(int id);

    @Query(value = "SELECT pi.image_id  from poi p join poi_image pi on p.activity_id=pi.poi_id  where p.activity_id=:id limit 1",nativeQuery = true)
    public String getThumbnailById(int id);
}
