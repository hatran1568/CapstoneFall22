package com.tripplanner.TripService.service.interfaces;

import com.tripplanner.TripService.dto.response.ChecklistDTO;
import com.tripplanner.TripService.dto.response.ChecklistItemDTO;
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
