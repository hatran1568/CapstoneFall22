package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.ChecklistDTO;
import com.planner.backendserver.DTO.response.ChecklistItemDTO;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface ChecklistService {
  ChecklistDTO getChecklistItemsByTripId(int tripId, int userId);
  boolean itemExists(int itemId);

  void updateCheckedState(int itemId, Boolean checked);
  void deleteItemById(int id);

  ChecklistItemDTO editItemById(ChecklistItemDTO newItem, int id);

  ChecklistItemDTO addItem(ChecklistItemDTO checklistItemDTO);
}
