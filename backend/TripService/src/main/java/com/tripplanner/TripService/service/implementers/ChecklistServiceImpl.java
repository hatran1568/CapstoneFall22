package com.tripplanner.TripService.service.implementers;

import com.tripplanner.TripService.dto.response.ChecklistDTO;
import com.tripplanner.TripService.dto.response.ChecklistItemDTO;
import com.tripplanner.TripService.dto.response.TripGeneralDTO;
import com.tripplanner.TripService.entity.ChecklistItem;
import com.tripplanner.TripService.entity.Trip;
import com.tripplanner.TripService.repository.ChecklistItemRepository;
import com.tripplanner.TripService.repository.TripRepository;
import com.tripplanner.TripService.service.interfaces.ChecklistService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ChecklistServiceImpl implements ChecklistService {
    @Autowired
    ModelMapper mapper;
    @Autowired
    private ChecklistItemRepository checklistItemRepository;
    @Autowired
    private TripRepository tripRepository;

    public ChecklistDTO getChecklistItemsByTripId(int tripId, int userId) {
        Trip trip = tripRepository.findDetailedTripById(tripId, userId);
        if (trip == null) return null;
        ChecklistDTO checklistDTO = new ChecklistDTO();
        checklistDTO.setTrip(mapper.map(trip, TripGeneralDTO.class));
        ArrayList<ChecklistItemDTO> checklistItemDTOS = new ArrayList<>();
        ArrayList<ChecklistItem> checklistItems = checklistItemRepository.getByTripId(tripId);
        for (ChecklistItem item : checklistItems
        ) {
            ChecklistItemDTO checklistItemDTO = mapper.map(item, ChecklistItemDTO.class);
            checklistItemDTOS.add(checklistItemDTO);
        }
        checklistDTO.setChecklistItems(checklistItemDTOS);
        return checklistDTO;
    }

    @Override
    public boolean itemExists(int itemId) {
        return checklistItemRepository.existsById(itemId);
    }

    @Override
    public void updateCheckedState(int itemId, Boolean checked) {
        checklistItemRepository.updateCheckedState(itemId, checked);
    }

    @Override
    public void deleteItemById(int id) {
        checklistItemRepository.deleteItemById(id);
    }

    @Override
    public ChecklistItemDTO editItemById(ChecklistItemDTO newItem, int id) {
        return checklistItemRepository.findById(id).map(item -> {
            item.setTitle(newItem.getTitle());
            item.setNote(newItem.getNote());
            item.setChecked(newItem.isChecked());
            return mapper.map(checklistItemRepository.save(item), ChecklistItemDTO.class);
        }).orElseGet(() -> {
            return null;
        });
    }

    @Override
    public ChecklistItemDTO addItem(ChecklistItemDTO checklistItemDTO) {
        ChecklistItem item = mapper.map(checklistItemDTO, ChecklistItem.class);
        return mapper.map(checklistItemRepository.save(item), ChecklistItemDTO.class);
    }
}
