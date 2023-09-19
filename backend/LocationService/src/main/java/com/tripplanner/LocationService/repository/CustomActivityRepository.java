package com.tripplanner.LocationService.repository;

import com.tripplanner.LocationService.entity.CustomActivity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomActivityRepository
  extends JpaRepository<CustomActivity, Integer> {
  @Override
  CustomActivity save(CustomActivity customActivity);

  @Override
  Optional<CustomActivity> findById(Integer id);

  @Query(
    value = "insert into custom_activity(activity_id) VALUE(?1)",
    nativeQuery = true
  )
  void insertCustomActivity(int id);

  @Query(
    value = "SELECT m.activity_id as activityId FROM master_activity m join custom_activity p on p.activity_id=m.activity_id ORDER BY p.activity_id DESC LIMIT 1",
    nativeQuery = true
  )
  int getLastestCustomActivity();
}
