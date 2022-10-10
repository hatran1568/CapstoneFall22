package com.planner.backendserver.repository;

import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository

public interface POIRepository extends JpaRepository<POI,Integer> {

}
