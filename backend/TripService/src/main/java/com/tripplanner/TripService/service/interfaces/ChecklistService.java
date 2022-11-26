package com.tripplanner.TripService.service.interfaces;


import com.tripplanner.TripService.dto.response.ChecklistItemDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChecklistService {
    List<ChecklistItemDTO> getChecklistItemsByTripId(int tripId);
    boolean itemExists(int itemId);

    void updateCheckedState(int itemId, Boolean checked);
    void deleteItemById(int id);

    ChecklistItemDTO editItemById(ChecklistItemDTO newItem, int id);

    ChecklistItemDTO addItem(ChecklistItemDTO checklistItemDTO);
}
