package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.response.ChecklistItemDTO;
import com.planner.backendserver.DTO.response.TripDetailDTO;
import com.planner.backendserver.entity.ChecklistItem;
import com.planner.backendserver.repository.ChecklistItemRepository;
import com.planner.backendserver.service.interfaces.ChecklistService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class ChecklistServiceImpl implements ChecklistService {
    @Autowired
    ModelMapper mapper;
    @Autowired
    private ChecklistItemRepository checklistItemRepository;
    public List<ChecklistItemDTO> getChecklistItemsByTripId(int tripId){
        List<ChecklistItemDTO> checklistItemDTOS = new ArrayList<>();
        List<ChecklistItem> checklistItems = checklistItemRepository.getByTripId(tripId);
        for (ChecklistItem item: checklistItems
        ) {
            ChecklistItemDTO checklistItemDTO = mapper.map(item, ChecklistItemDTO.class);
            checklistItemDTOS.add(checklistItemDTO);
        }
        return checklistItemDTOS;
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
    public void deleteItemById(int id){
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
