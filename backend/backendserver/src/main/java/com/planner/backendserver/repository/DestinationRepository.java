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

}
