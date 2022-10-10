package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.DestinationImage;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.User;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepository extends JpaRepository<Destination,Integer> {
    @Query(
        value = "SELECT * from Destination d where d.destination_id = ?1",
        nativeQuery = true)
    Destination getDestinationById(int destinationId);

    @Query(
        value = "SELECT p.google_rate, c.category_name, m.name from POI p LEFT JOIN master_activity m ON m.activity_id = p.activity_id LEFT JOIN category c ON p.category_id = c.category_id where p.destination_id = ?1 limit 3",
        nativeQuery = true)
    ArrayList<POI> get3FirstPOIofDestination(int destinationId);

    @Query(
        value = "SELECT di.url FROM destination_image di where di.destination_id = ?1",
        nativeQuery = true)
    ArrayList<String> getDestinationImagesURL(int destinationId);
}
