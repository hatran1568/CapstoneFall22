package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.request.POIofDestinationDTO;

import java.awt.*;
import java.util.ArrayList;

import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

@Repository
public interface POIRepository extends JpaRepository<POI, Integer> {
    @Query(
            value = "SELECT ma.activity_id as activityId, ma.name as name, c.category_name as categoryName, p.google_rate as googleRating, p.description as description, p.typical_price as typicalPrice, pi.url as image from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id LEFT JOIN master_activity ma on p.activity_id = ma.activity_id LEFT JOIN category c on p.category_id = c.category_id LEFT JOIN poi_image pi on p.activity_id = pi.poi_id where pd.destination_id = ?1 AND p.google_rate >= ?4 limit ?2, ?3",
            nativeQuery = true)
    ArrayList<POIofDestinationDTO> getPOIOfDestination(int desId, int start, int count, int rating);

    @Query(
            value = "SELECT ma.activity_id as activityId, ma.name as name, c.category_name as categoryName, p.google_rate as googleRating, p.description as description, p.typical_price as typicalPrice, pi.url as image from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id LEFT JOIN master_activity ma on p.activity_id = ma.activity_id LEFT JOIN category c on p.category_id = c.category_id LEFT JOIN poi_image pi on p.activity_id = pi.poi_id where pd.destination_id = ?1 AND p.category_id = ?2 AND p.google_rate >= ?5 limit ?3, ?4",
            nativeQuery = true)
    ArrayList<POIofDestinationDTO> getPOIOfDestinationFilter(int desId, int catId, int start, int count, int rating);

    @Query(
            value = "SELECT COUNT(*) from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id where pd.destination_id = ?1 AND p.google_rate >= ?2",
            nativeQuery = true)
    int getCountPOIOfDestination(int desId, int rating);

    @Query(
            value = "SELECT COUNT(*) from POI p LEFT JOIN poi_destination pd on p.activity_id = pd.poi_id where pd.destination_id = ?1 AND p.category_id = ?2 AND p.google_rate >= ?3",
            nativeQuery = true)
    int getCountPOIOfDestinationFilter(int desId, int catId, int rating);

    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :id")
    MasterActivity getPOIByActivityId(int id);
    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :id")
    POI getById(int id);
    @Query("select d.distance from Distance d where d.startStation.activityId = :from and d.endStation.activityId =:to")
    Optional<Double> getDistanceBetweenTwoPOIs(int from, int to);

    @Query("SELECT p from POI p where p.name like  CONCAT('%',:keyword,'%')")
    ArrayList<POI> findPOISByKeyword(String keyword);

    @Query("SELECT COUNT(p.activityId) FROM POI p join Rating r on p.activityId=r.POI.activityId GROUP BY p.activityId HAVING p.activityId=:id")
    Optional<Integer> getNumberOfRateByActivityId(int id);

    @Query("select r from Rating r join User u on r.user.userID = u.userID where r.POI.activityId = :id")
    ArrayList<Rating> getRatingsByPOIId(int id);

    @Modifying
    @Transactional
    @Query("update Rating r set r.rate = :rate, r.Comment = :comment, r.dateModified = :modified where r.user.userID = :uid and r.POI.activityId = :poiId")
    void updateRatingInPOI(int rate, String comment, Date modified, int uid, int poiId);

    @Modifying
    @Transactional
    @Query(value = "insert into rating (comment, date_created, date_modified, is_deleted, rate, poi_id, user_id)\n" +
            "values (:comment, :created, :modified, false, :rate, :poiId, :uid)", nativeQuery = true)
    void createRatingInPOI(String comment, Date created, Date modified, int rate, int poiId, int uid);

    @Query("select pi.url from POIImage pi where pi.poi.activityId = :id")
    ArrayList<String> getImagesByPOIId(int id);

    @Query(value = "SELECT pi.url from poi p join poi_image pi on p.activity_id=pi.poi_id  where p.activity_id=:id limit 1", nativeQuery = true)
    Optional<String> getThumbnailById(int id);

    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :masterActivityId")
    Optional<POI> getPOIByMasterActivity(int masterActivityId);

}
