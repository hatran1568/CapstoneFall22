package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.ArrayList;

public interface CollectionRepository extends JpaRepository<Collection, Integer> {
    @Query("select c from Collection c left join User u on c.user.userID = u.userID where c.user.userID = :id")
    ArrayList<Collection> getCollectionsByUserID(int id);

    @Query("select c, cp, m" +
            " from Collection c" +
            " left join CollectionPOI cp on c.collectionId = cp.collection.collectionId" +
            " left join MasterActivity m on cp.poi.activityId = m.activityId" +
            " where c.user.userID = :id and c.isDeleted = false")
    ArrayList<Collection> getCollectionDetailsByUserID(int id);

    @Query("select c from Collection c where c.collectionId = (select max(c.collectionId) from Collection c)")
    Collection getNewestCollectionID();

    @Modifying
    @Transactional
    @Query(value = "insert into" +
            " collection (date_created, date_modified, description, is_deleted, title, user_id)" +
            " values (:dateCreated, :dateModified, :description, :isDeleted, :title, :uid)",
            nativeQuery = true)
    void createNewCollection(Date dateCreated, Date dateModified, String description, boolean isDeleted, String title, int uid);

    @Modifying
    @Transactional
    @Query("update Collection c set c.isDeleted = true where c.collectionId = :id")
    void deleteCollectionById(int id);
}