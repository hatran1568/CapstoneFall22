package com.example.Optimizer.repository;

import com.example.Optimizer.entity.POI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface POIRepository extends JpaRepository<POI, Integer> {
    @Query("Select p from POI p join POIDest pd on p.activityId = pd.poi.activityId where pd.destination.destinationId=:id and pd.poi.category.categoryID <>10 and pd.poi.category.categoryID <>11")
    public ArrayList<POI> getPOIsByDestinationId(int id);

}
