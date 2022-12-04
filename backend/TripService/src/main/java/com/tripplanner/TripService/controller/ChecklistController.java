package com.tripplanner.TripService.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tripplanner.TripService.dto.response.ChecklistDTO;
import com.tripplanner.TripService.dto.response.ChecklistItemDTO;
import com.tripplanner.TripService.service.interfaces.ChecklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trip/api/checklist")
public class ChecklistController {
    @Autowired
    private ChecklistService checklistService;

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/get-by-trip")
    public ResponseEntity<ChecklistDTO> getChecklistItemsByTripId(@RequestParam int tripId, @RequestParam(required = false) Integer userId) {
//        try{
        if (userId == null) userId = -1;
        ChecklistDTO result = checklistService.getChecklistItemsByTripId(tripId, userId);
        if (result == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/toggle-checked")
    public ResponseEntity<?> updateCheckedState(@RequestBody ObjectNode request) {
        try {
            int itemId = request.get("itemId").asInt();
            Boolean checked = request.get("checked").asBoolean();
            if (!checklistService.itemExists(itemId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            checklistService.updateCheckedState(itemId, checked);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @DeleteMapping("/delete-item")
    public ResponseEntity<?> deleteItem(@RequestBody ObjectNode objectNode) {
        try {
            int itemId = objectNode.get("itemId").asInt();
            checklistService.deleteItemById(itemId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PutMapping("/put-item")
    public ResponseEntity<ChecklistItemDTO> editTripDetail(@RequestBody ChecklistItemDTO newItem, @RequestParam int id) {
        try {
            ChecklistItemDTO item = checklistService.editItemById(newItem, id);
            if (item == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(item, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PostMapping("/add-item")
    public ResponseEntity<ChecklistItemDTO> addItem(@RequestBody ChecklistItemDTO checklistItemDTO) {
        try {
            ChecklistItemDTO result = checklistService.addItem(checklistItemDTO);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
