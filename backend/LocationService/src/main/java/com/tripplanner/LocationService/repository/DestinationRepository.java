package com.tripplanner.LocationService.repository;


import com.tripplanner.LocationService.dto.request.GalleryImages;
import com.tripplanner.LocationService.dto.request.POIBoxDTO;
import com.tripplanner.LocationService.dto.response.*;
import com.tripplanner.LocationService.entity.Destination;
import com.tripplanner.LocationService.dto.response.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination,Integer> {
    @Query(
        value = "SELECT destination_id as desId, description,\n" +
                "       is_deleted as deleted, name\n" +
                "from Destination d where d.destination_id = ?1",
        nativeQuery = true)
    DesDetailsDTO getDestinationById(int destinationId);

    @Query(
        value = "SELECT p.activity_id as activityId, p.google_rate as googleRate, c.category_name as categoryName, m.name as name, pi.url as image from POI p LEFT JOIN master_activity m ON m.activity_id = p.activity_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN poi_destination pd ON p.activity_id = pd.poi_id LEFT JOIN poi_image pi on p.activity_id = pi.poi_id where pd.destination_id = ?1 limit 3",
        nativeQuery = true)
    ArrayList<POIBoxDTO> get3FirstPOIofDestination(int destinationId);

    @Query(
        value = "SELECT di.url as original, di.url as thumbnail FROM destination_image di where di.destination_id = ?1",
        nativeQuery = true)
    ArrayList<GalleryImages> getDestinationImagesURL(int destinationId);
    @Query("SELECT d from Destination d where d.name like  CONCAT('%',:keyword,'%')")
    public ArrayList<Destination> getDestinationsByKeyword(String keyword);

    @Query(value = "SELECT i.url from destination  d join destination_image  i on d.destination_id=i.destination_id where d.destination_id=:id Limit 1",nativeQuery = true)
    public Optional<String> getThumbnailById(int id);

    @Query(
            value = "SELECT * FROM destination",
            nativeQuery = true)
    ArrayList<Destination> getAllDes();
    @Query(
            value = "SELECT d2.destination_id as desId, d2.date_created as dateCreated, d2.date_modified as dateModified,\n" +
                    "       d2.name, d.name as belongTo,\n" +
                    "       (SELECT COUNT(*) FROM poi_destination pd WHERE pd.destination_id = d2.destination_id) as POIs\n" +
                    "FROM destination d\n" +
                    "    RIGHT JOIN destination d2 ON d.destination_id = d2.belong_to\n" +
                    "WHERE d2.is_deleted = false AND d2  .name LIKE CONCAT('%',?2,'%')\n" +
                    "ORDER BY\n" +
                    "    (CASE\n" +
                    "        WHEN (?1 = 'dateDESC') THEN d2.date_modified\n" +
                    "        WHEN (?1 = 'nameDESC') THEN d2.name\n" +
                    "        WHEN (?1 = 'belongDESC') THEN belongTo\n" +
                    "    END\n" +
                    ") DESC,\n" +
                    "    (CASE\n" +
                    "        WHEN (?1 = 'dateASC') THEN d2.date_modified\n" +
                    "        WHEN (?1 = 'nameASC') THEN d2.name\n" +
                    "        WHEN (?1 = 'belongASC') THEN belongTo\n" +
                    "    END\n" +
                    ") ASC\n" +
                    "LIMIT ?3, ?4",
            nativeQuery = true)
    ArrayList<DesListDTO> getDesListAdmin(String filter, String nameKeyword, int page, int skip);
    @Query(
            value = "SELECT COUNT(*)\n" +
                    "FROM destination d\n" +
                    "WHERE d.is_deleted = false AND d.name LIKE CONCAT('%',?1,'%')",
            nativeQuery = true)
    int getDesListAdminCount(String keyWord);
    @Query(
            value = "SELECT pd.destination_id as value, d.name as label\n" +
                    "FROM poi_destination pd\n" +
                    "    LEFT JOIN destination d on pd.destination_id = d.destination_id\n" +
                    "WHERE pd.poi_id = ?1",
            nativeQuery = true)
    ArrayList<DesSelectDTO> getAllDesOfPOI(int poiId);
    @Query(
            value = "SELECT destination_id as value, name as label\n" +
                    "FROM destination ORDER BY belong_to",
            nativeQuery = true)
    ArrayList<DesSelectDTO> getAllDesSelect();
    @Modifying
    @Transactional
    @Query(
            value = "DELETE FROM poi_destination WHERE poi_id = ?1",
            nativeQuery = true)
    void deleteAllPOIDes(int poiId);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO poi_destination(poi_id, destination_id) VALUES (?1, ?2)",
            nativeQuery = true)
    void addPOIDes(int poiId, int desId);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE destination SET is_deleted = true WHERE destination_id = ?1",
            nativeQuery = true)
    void deleteDes(int desId);
    @Query(
            value = "SELECT d.destination_id as desId, d.name, d.description, IF(d.belong_to IS NULL, '0', d.belong_to) as belongId, IF(d.belong_to IS NULL, 'Chưa có', d2.name) as belongName\n" +
                    "FROM destination d2 RIGHT JOIN destination d ON d.belong_to = d2.destination_id\n" +
                    "WHERE d.destination_id = ?1",
            nativeQuery = true)
    DesAddUpdateDTO getDesUpdate(int desId);
    @Query(
            value = "SELECT image_id as imageId, destination_id as poiId, description, url FROM destination_image\n" +
                    "WHERE destination_id = ?1",
            nativeQuery = true)
    ArrayList<POIImageUpdateDTO> getDesImagesUpdate(int desId);

    @Query(
            value = "SELECT url FROM destination_image WHERE image_id = ?1",
            nativeQuery = true)
    String getUrlDesImage(int imgId);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO destination_image(description, url, destination_id) VALUES (?2, ?3, ?1)",
            nativeQuery = true)
    void addImage(int desId, String description, String url);
    @Modifying
    @Transactional
    @Query(
            value = "DELETE FROM destination_image\n" +
                    "WHERE image_id = ?1",
            nativeQuery = true)
    void deleteImage(int imgId);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE destination SET name = ?2, description = ?3, date_modified = ?4, belong_to = ?5\n" +
                    "WHERE destination_id = ?1",
            nativeQuery = true)
    void updateDes(int desId, String name, String desc, Timestamp dateModified, int belong);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO destination(name, description, date_created, date_modified,\n" +
                    "                is_deleted, belong_to)\n" +
                    "VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            nativeQuery = true)
    void addDes(String name, String description, Timestamp created, Timestamp modified, boolean deleted, int belong);
    @Query(
            value = "SELECT destination_id as desId FROM destination ORDER BY destination_id DESC LIMIT 1",
            nativeQuery = true)
    int getLastestDes();
}
