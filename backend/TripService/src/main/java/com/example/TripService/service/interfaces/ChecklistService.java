package com.example.TripService.service.interfaces;


import com.example.TripService.dto.response.ChecklistDTO;
import com.example.TripService.dto.response.ChecklistItemDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChecklistService {
    ChecklistDTO getChecklistItemsByTripId(int tripId, int userId);
    boolean itemExists(int itemId);

    void updateCheckedState(int itemId, Boolean checked);
    void deleteItemById(int id);

    ChecklistItemDTO editItemById(ChecklistItemDTO newItem, int id);

    ChecklistItemDTO addItem(ChecklistItemDTO checklistItemDTO);
}
