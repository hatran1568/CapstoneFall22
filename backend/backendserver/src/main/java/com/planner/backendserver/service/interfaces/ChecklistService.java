package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.ChecklistItemDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChecklistService {
    List<ChecklistItemDTO> getChecklistItemsByTripId(int tripId);
    boolean itemExists(int itemId);

    void updateCheckedState(int itemId, Boolean checked);
    void deleteItemById(int id);
}
