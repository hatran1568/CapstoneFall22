package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface CollectionRepository extends JpaRepository<Collection, Integer> {
    @Query("select c from Collection c left join User u on c.user.userID = u.userID where c.user.userID = :id")
    ArrayList<Collection> getCollectionsByUserID(int id);
}