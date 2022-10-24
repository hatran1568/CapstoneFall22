package com.planner.backendserver.repository;

import com.planner.backendserver.entity.CustomActivity;
import com.planner.backendserver.entity.MasterActivity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomActivityRepository extends JpaRepository<CustomActivity,Integer> {
    @Override
    CustomActivity save(CustomActivity customActivity);
}
