package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Destination;
import org.hibernate.sql.Select;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface DestinationRepository extends JpaRepository<Destination,Integer> {
    @Query("SELECT d from Destination d where d.name like  CONCAT('%',:keyword,'%')")
    public ArrayList<Destination> getDestinationsByKeyword(String keyword);

    @Query(value = "SELECT i.image_id from destination  d join destination_image  i on d.destination_id=i.image_id where d.destination_id=:id Limit 1",nativeQuery = true)
    public String getThumbnailById(int id);
}
