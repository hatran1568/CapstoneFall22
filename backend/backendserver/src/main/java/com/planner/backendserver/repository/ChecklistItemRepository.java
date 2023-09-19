package com.planner.backendserver.repository;

import com.planner.backendserver.entity.ChecklistItem;
import java.util.ArrayList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ChecklistItemRepository
  extends JpaRepository<ChecklistItem, Integer> {
  @Query(
    value = "select * from checklist_item where trip_id=:tripId  and is_deleted=false",
    nativeQuery = true
  )
  ArrayList<ChecklistItem> getByTripId(int tripId);

  @Modifying
  @Transactional
  @Query(
    "update ChecklistItem item set item.checked = :checked where item.itemId=:itemId"
  )
  void updateCheckedState(int itemId, boolean checked);

  @Modifying
  @Transactional
  @Query(
    "update ChecklistItem item set item.isDeleted = true where item.itemId = :id"
  )
  void deleteItemById(int id);
}
