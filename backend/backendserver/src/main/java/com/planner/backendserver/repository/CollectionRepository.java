package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.CollectionDTO;
import com.planner.backendserver.entity.Collection;
import com.planner.backendserver.entity.CollectionPOI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.ArrayList;

public interface CollectionRepository extends JpaRepository<Collection, Integer> {
    // getting collections here
    @Query(value = "select *\n" +
            "from (select c.collection_id, c.date_modified, c.description, c.is_deleted, title, user_id, min(pi.url)\n" +
            "      from collection c\n" +
            "               left join collection_poi cp on c.collection_id = cp.collection_id\n" +
            "               left join poi p on cp.poi_id = p.activity_id\n" +
            "               left join poi_image pi on p.activity_id = pi.poi_id\n" +
            "      group by c.collection_id) lmao\n" +
            "where lmao.user_id = :id", nativeQuery = true)
    ArrayList<CollectionDTO> getCollectionsByUserID(int id);

    @Query("select c from Collection c where c.collectionId = (select max(c.collectionId) from Collection c)")
    Collection getNewestCollectionID();

    // getting POI list here
    @Query("select cp, m" +
            " from CollectionPOI cp" +
            " left join MasterActivity m on cp.poi.activityId = m.activityId" +
            " where cp.collection.collectionId = :id")
    ArrayList<CollectionPOI> getPOIListOfCollectionByID(int id);

    @Query("select cp from CollectionPOI cp where cp.poi.activityId = :poiId and cp.collection.collectionId = :colId")
    CollectionPOI getPOIFromCollection(int poiId, int colId);

    // modifying collection list here
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

    // modifying POI list here
    @Modifying
    @Transactional
    @Query(value = "insert into collection_poi (poi_id, collection_id) values (:poiId, :colId)", nativeQuery = true)
    void addPOIIntoCollection(int poiId, int colId);

    @Modifying
    @Transactional
    @Query("delete from CollectionPOI cp where cp.poi.activityId = :poiId and cp.collection.collectionId = :colId")
    void removePOIFromCollection(int poiId, int colId);

    @Modifying
    @Transactional
    @Query("update CollectionPOI cp set cp.poi.activityId = :poiId" +
            " where cp.poi.activityId = :poiId and cp.collection.collectionId = :colId")
    void updatePOIInCollection(int poiId, int colId);
}