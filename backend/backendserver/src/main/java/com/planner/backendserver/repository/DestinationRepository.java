package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.GalleryImages;
import com.planner.backendserver.DTO.POIBoxDTO;
import com.planner.backendserver.entity.Destination;

import java.util.ArrayList;

import org.hibernate.sql.Select;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination,Integer> {
    @Query(
        value = "SELECT * from Destination d where d.destination_id = ?1",
        nativeQuery = true)
    Destination getDestinationById(int destinationId);

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

    @Query(value = "SELECT i.url from destination  d join destination_image  i on d.destination_id=i.image_id where d.destination_id=:id Limit 1",nativeQuery = true)
    public Optional<String> getThumbnailById(int id);

}
