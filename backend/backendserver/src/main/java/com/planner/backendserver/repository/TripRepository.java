package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.GalleryImages;
import com.planner.backendserver.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;


@Repository
@Transactional
public interface TripRepository extends JpaRepository<Trip, Integer> {
    Optional<Trip> findById(int id);
    ArrayList<Trip> getTripsByUser(String email);

    @Modifying
    @Query(
            value = "INSERT INTO trip (date_created, budget, `name`, user_id, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            nativeQuery = true)
    void createEmptyTrip(Date dateCreated, double budget, String name, int userId, Date startDate, Date endDate);

}
