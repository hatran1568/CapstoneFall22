package com.example.LocationService.repository;


import com.example.LocationService.entity.MasterActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MasterActivityRepository extends JpaRepository<MasterActivity,Integer> {
    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :id")
    MasterActivity getPOIByActivityId(int id);


    @Query("select m from MasterActivity m where m.activityId = :id")
    MasterActivity getById(int id);
    @Override
    MasterActivity save(MasterActivity masterActivity);


}
