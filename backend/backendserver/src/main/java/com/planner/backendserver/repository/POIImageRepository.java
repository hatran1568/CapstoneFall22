package com.planner.backendserver.repository;

import com.planner.backendserver.entity.POIImage;
import java.util.ArrayList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface POIImageRepository extends JpaRepository<POIImage, Integer> {
  @Query("select i from POIImage i where i.poi.activityId = :id")
  ArrayList<POIImage> findAllByPOIId(int id);

  @Query(
    value = "select * from poi_image i where i.poi_id = :poiId order by i.image_id asc limit 1",
    nativeQuery = true
  )
  POIImage findFirstByPoiId(int poiId);
}
