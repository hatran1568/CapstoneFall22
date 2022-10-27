package com.planner.backendserver.repository;

import com.planner.backendserver.entity.MasterActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MasterActivityRepository extends JpaRepository<MasterActivity,Integer> {
    @Query("SELECT p FROM POI p left join MasterActivity m on p.activityId = m.activityId where p.activityId = :id")
    MasterActivity getMasterActivityByActivityId(int id);
    @Override
    MasterActivity save(MasterActivity masterActivity);

}
