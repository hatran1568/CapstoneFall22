package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.request.POIListDTO;
import com.planner.backendserver.DTO.request.POIofDestinationDTO;

import java.awt.*;
import java.sql.Timestamp;
import java.util.ArrayList;

import com.planner.backendserver.DTO.response.POIImageUpdateDTO;
import com.planner.backendserver.DTO.response.POIUpdateDTO;
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


    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId  left join Distance dis on dis.startStation.activityId =p.activityId where  p.category.categoryID=10 and dis.distance< :distance and dis.endStation.activityId=:src and (p.typicalPrice =:minPrice or p.typicalPrice>:minPrice) and (p.typicalPrice =:maxPrice or p.typicalPrice<:maxPrice) and (p.googleRate =:minRate or p.typicalPrice>:minRate) and (p.googleRate =:maxRate or p.typicalPrice>:maxRate)")
    Optional<ArrayList<POI>> getHotelByDestination(double distance,int src,double maxRate,double minRate,double maxPrice,double minPrice);

    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId  where  p.category.categoryID=10  and (p.typicalPrice =:minPrice or p.typicalPrice>:minPrice) and (p.typicalPrice =:maxPrice or p.typicalPrice<:maxPrice) and (p.googleRate =:minRate or p.typicalPrice>:minRate) and (p.googleRate =:maxRate or p.typicalPrice>:maxRate)")
    Optional<ArrayList<POI>> getHotelByPriceAndRate(double maxRate,double minRate,double maxPrice,double minPrice);

    @Query(
            value = "SELECT ma.activity_id as activityId, ma.name, p.google_rate as rating, p.website,\n" +
                    "       p.telephone_number as phoneNumber, c.category_name as categoryName, c.category_id as categoryId, p.date_created as dateCreated, p.date_modified as dateModified\n" +
                    "FROM poi p LEFT JOIN master_activity ma on p.activity_id = ma.activity_id\n" +
                    "           LEFT JOIN category c on p.category_id = c.category_id\n" +
                    "WHERE ma.name LIKE CONCAT('%',?3,'%')\n" +
                    "AND p.is_deleted = false AND IF(?2 <> '0', c.category_id = ?2, c.category_id LIKE CONCAT('%','','%'))\n" +
                    "ORDER BY\n" +
                    "(CASE\n" +
                    "    WHEN (?1 = 'ratingDESC') THEN rating\n" +
                    "    WHEN (?1 = 'nameDESC') THEN ma.name\n" +
                    "    WHEN (?1 = 'dateDESC') THEN p.date_modified\n" +
                    "END\n" +
                    ") DESC,\n" +
                    "(CASE\n" +
                    "    WHEN (?1 = 'ratingASC') THEN rating\n" +
                    "    WHEN (?1 = 'nameASC') THEN ma.name\n" +
                    "    WHEN (?1 = 'dateASC') THEN p.date_modified\n" +
                    "END\n" +
                    ") ASC\n" +
                    "LIMIT ?4, ?5",
            nativeQuery = true)
    ArrayList<POIListDTO> getPOIListAdmin(String filter, int categoryId, String nameKeyword, int page, int skip);

    @Query(
            value = "SELECT COUNT(*)\n" +
                    "FROM poi p LEFT JOIN master_activity ma on p.activity_id = ma.activity_id\n" +
                    "           LEFT JOIN category c on p.category_id = c.category_id\n" +
                    "WHERE ma.name LIKE CONCAT('%',?2,'%')\n" +
                    "AND p.is_deleted = false AND IF(?1 <> '0', c.category_id = ?1, c.category_id LIKE CONCAT('%','','%'))",
            nativeQuery = true)
    int getPOIListAdminCount(int categoryId, String nameKeyword);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE poi\n" +
                    "SET is_deleted = true\n" +
                    "WHERE activity_id = ?1",
            nativeQuery = true)
    void deletePOI(int poiId);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO poi_destination VALUES (?1, ?2)",
            nativeQuery = true)
    void addPOIDes(int poiId, int desId);

    @Query(
            value = "SELECT ma.activity_id as activityId, ma.address, ma.name, p.description, p.additional_information as additionalInfo,\n" +
                    "       p.business_email as email, p.opening_time as openingTime, p.closing_time as closingTime, p.duration, p.typical_price as price,\n" +
                    "       p.google_rate as rating, p.telephone_number as phoneNumber, p.website, p.category_id as categoryId,\n" +
                    "       c.category_name as categoryName, p.latitude as lat, p.longitude as lon\n" +
                    "FROM master_activity ma\n" +
                    "    LEFT JOIN poi p on ma.activity_id = p.activity_id\n" +
                    "    LEFT JOIN category c on p.category_id = c.category_id\n" +
                    "WHERE ma.activity_id = ?1",
            nativeQuery = true)
    POIUpdateDTO getPOIUpdate(int activityId);

    @Query(
            value = "SELECT image_id as imageId, poi_id as poiId, description, url FROM poi_image\n" +
                    "WHERE poi_id = ?1",
            nativeQuery = true)
    ArrayList<POIImageUpdateDTO> getPOIImagesUpdate(int activityId);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE poi SET description = ?2, additional_information = ?3, business_email = ?4, closing_time = ?5,\n" +
                    "               date_modified = ?6, duration = ?7, opening_time = ?8, telephone_number = ?9,\n" +
                    "               typical_price = ?10, website = ?11, category_id = ?12, google_rate = ?13, latitude = ?14, longitude = ?15\n" +
                    "WHERE activity_id = ?1",
            nativeQuery = true)
    void updatePOI(int poiId, String description, String info, String email, int close, Timestamp dateModified, int duration, int open, String phone, double price, String web, int catId, double rate, double lat, double lon);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE master_activity\n" +
                    "SET address = ?2, name = ?3\n" +
                    "WHERE activity_id = ?1",
            nativeQuery = true)
    void updateMA(int poiId, String address, String name);
    @Query(
            value = "SELECT activity_id as activityId FROM master_activity ORDER BY activity_id DESC LIMIT 1",
            nativeQuery = true)
    int getLastestPOI();

    @Query(
            value = "SELECT url FROM poi_image WHERE image_id = ?1",
            nativeQuery = true)
    String getUrlPOIImage(int imgId);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO poi_image(description, url, poi_id) VALUES (?2, ?3, ?1)",
            nativeQuery = true)
    void addImage(int poiId, String description, String url);
    @Modifying
    @Transactional
    @Query(
            value = "DELETE FROM poi_image\n" +
                    "WHERE image_id = ?1",
            nativeQuery = true)
    void deleteImage(int imgId);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO master_activity(address, name) VALUES (?1, ?2)",
            nativeQuery = true)
    void addMA(String address, String name);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO poi(description, additional_information, business_email, closing_time, date_created, date_modified,\n" +
                    "                duration, opening_time, telephone_number, typical_price, website, activity_id, category_id, google_rate, is_deleted, latitude, longitude)\n" +
                    "VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)",
            nativeQuery = true)
    void addPOI(String description, String info, String email, int close, Timestamp created, Timestamp modified, int duration, int open, String phone, double price, String web, int activityId, int catId, double rate, boolean deleted, double lat, double lon);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO poi_destination(poi_id, destination_id) VALUES (?1, ?2)",
            nativeQuery = true)
    void addPoiDes(int poiId, int desId);



    @Query("Select p from POI p join POIDest pd on p.activityId = pd.poi.activityId where pd.destination.destinationId=:id and pd.poi.category.categoryID <>10 and pd.poi.category.categoryID <>11")
    public ArrayList<POI> getPOIsByDestinationId(int id);
}
