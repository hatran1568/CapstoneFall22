package com.tripplanner.LocationService.repository;

import com.tripplanner.LocationService.entity.Collection;
import com.tripplanner.LocationService.entity.CollectionPOI;
import com.tripplanner.LocationService.entity.POI;
import java.util.ArrayList;
import java.util.Date;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface CollectionRepository
  extends JpaRepository<Collection, Integer> {
  // getting collections here
  @Query("select c from Collection c where c.user = :id")
  ArrayList<Collection> getCollectionsByUserID(int id);

  @Query(
    "select c from Collection c where c.collectionId = (select max(c.collectionId) from Collection c)"
  )
  Collection getNewestCollectionID();

  @Query("select c from Collection c where c.collectionId = :id")
  Collection getCollectionByID(int id);

  // getting POI list here
  @Query(
    "select cp" +
    " from CollectionPOI cp" +
    " where cp.collection.collectionId = :id"
  )
  ArrayList<CollectionPOI> getPOIListOfCollectionByID(int id);

  @Query(
    "select cp from CollectionPOI cp where cp.poi.activityId = :poiId and cp.collection.collectionId = :colId"
  )
  CollectionPOI getPOIFromCollection(int poiId, int colId);

  @Query(
    "select min(cp.poi) from CollectionPOI cp where cp.collection.collectionId = :colId"
  )
  POI getFirstPOIInCollection(int colId);

  // modifying collection list here
  @Modifying
  @Transactional
  @Query(
    value = "insert into" +
    " collection (date_created, date_modified, description, is_deleted, title, user_id)" +
    " values (:dateCreated, :dateModified, :description, :isDeleted, :title, :uid)",
    nativeQuery = true
  )
  void createNewCollection(
    Date dateCreated,
    Date dateModified,
    String description,
    boolean isDeleted,
    String title,
    int uid
  );

  @Modifying
  @Transactional
  @Query(
    "update Collection c set c.isDeleted = true where c.collectionId = :id"
  )
  void deleteCollectionById(int id);

  @Modifying
  @Transactional
  @Query(
    "update Collection c set c.title = :title, c.description = :desc, c.dateModified = :modified where c.collectionId = :id"
  )
  void updateCollectionInfo(int id, String title, String desc, Date modified);

  // modifying POI list here
  @Modifying
  @Transactional
  @Query(
    value = "insert into collection_poi (poi_id, collection_id) values (:poiId, :colId)",
    nativeQuery = true
  )
  void addPOIIntoCollection(int poiId, int colId);

  @Modifying
  @Transactional
  @Query(
    "delete from CollectionPOI cp where cp.poi.activityId = :poiId and cp.collection.collectionId = :colId"
  )
  void removePOIFromCollection(int poiId, int colId);

  @Modifying
  @Transactional
  @Query(
    "update CollectionPOI cp set cp.poi.activityId = :poiId" +
    " where cp.poi.activityId = :poiId and cp.collection.collectionId = :colId"
  )
  void updatePOIInCollection(int poiId, int colId);
}
