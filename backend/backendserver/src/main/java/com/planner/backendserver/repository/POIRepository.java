package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.GalleryImages;
import com.planner.backendserver.DTO.POIBoxDTO;
import com.planner.backendserver.DTO.POIofDestinationDTO;
import com.planner.backendserver.entity.Destination;

import java.awt.*;
import java.lang.reflect.Array;
import java.util.ArrayList;

import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface POIRepository extends JpaRepository<POI, Integer> {
    @Query(
            value = "SELECT ma.activity_id as activityId, ma.name as name, c.category_name as categoryName, p.google_rate as googleRating, p.description as description, p.typical_price as typicalPrice, pi.url as image from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id LEFT JOIN master_activity ma on p.activity_id = ma.activity_id LEFT JOIN category c on p.category_id = c.category_id LEFT JOIN poi_image pi on p.activity_id = pi.poi_id where pd.destination_id = ?1 limit ?2, ?3",
            nativeQuery = true)
    ArrayList<POIofDestinationDTO> getPOIOfDestination(int desId, int start, int count);

    @Query(
            value = "SELECT ma.activity_id as activityId, ma.name as name, c.category_name as categoryName, p.google_rate as googleRating, p.description as description, p.typical_price as typicalPrice, pi.url as image from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id LEFT JOIN master_activity ma on p.activity_id = ma.activity_id LEFT JOIN category c on p.category_id = c.category_id LEFT JOIN poi_image pi on p.activity_id = pi.poi_id where pd.destination_id = ?1 AND p.category_id = ?2 limit ?3, ?4",
            nativeQuery = true)
    ArrayList<POIofDestinationDTO> getPOIOfDestinationFilter(int desId, int catId, int start, int count);

    @Query(
            value = "SELECT COUNT(*) from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id where pd.destination_id = ?1",
            nativeQuery = true)
    int getCountPOIOfDestination(int desId);

    @Query(
            value = "SELECT COUNT(*) from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id where pd.destination_id = ?1 AND p.category_id = ?2",
            nativeQuery = true)
    int getCountPOIOfDestinationFilter(int desId, int catId);

    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :id")
    MasterActivity getPOIByActivityId(int id);

    @Query("select d.distance from Distance d where d.startStation.activityId = :from and d.endStation.activityId =:to")
    Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);

    @Query("SELECT p from POI p where p.name like  CONCAT('%',:keyword,'%')")
    ArrayList<POI> findPOISByKeyword(String keyword);

    @Query("SELECT COUNT(p.activityId) FROM POI p join Rating r on p.activityId=r.POI.activityId GROUP BY p.activityId HAVING p.activityId=:id")
    Optional<Integer> getNumberOfRateByActivityId(int id);

    @Query(value = "select r.rateId, r.Comment, r.dateCreated, r.isDeleted, r.rate, u.userID, u.avatar, u.name from Rating r join User u on r.user.userID = u.userID where r.POI.activityId = :id order by r.rateId asc limit 10", nativeQuery = true)
    ArrayList<Rating> getRatingsByPOIId(int id);

    @Query("select i from POIImage i where i.poi.activityId = :id")
    ArrayList<Image> getImagesByPOIId(int id);


    @Query(value = "SELECT pi.url  from poi p join poi_image pi on p.activity_id=pi.poi_id  where p.activity_id=:id limit 1", nativeQuery = true)
    public Optional<String> getThumbnailById(int id);


    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :masterActivityId")
    Optional<POI> getPOIByMasterActivity(int masterActivityId);

}
