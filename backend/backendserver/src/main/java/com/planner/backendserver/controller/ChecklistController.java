package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.planner.backendserver.DTO.response.ChecklistDTO;
import com.planner.backendserver.DTO.response.ChecklistItemDTO;
import com.planner.backendserver.service.interfaces.ChecklistService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checklist")
public class ChecklistController {

  @Autowired
  private ChecklistService checklistService;

  @GetMapping("/get-by-trip")
  public ResponseEntity<ChecklistDTO> getChecklistItemsByTripId(
    @RequestParam int tripId,
    @RequestParam int userId
  ) {
    try {
      ChecklistDTO checklistDTO = checklistService.getChecklistItemsByTripId(
        tripId,
        userId
      );
      if (checklistDTO == null) return new ResponseEntity<>(
        HttpStatus.NOT_FOUND
      );
      return new ResponseEntity<>(checklistDTO, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  @PutMapping("/put-item")
  public ResponseEntity<ChecklistItemDTO> editTripDetail(
    @RequestBody ChecklistItemDTO newItem,
    @RequestParam int id
  ) {
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

  @PostMapping("/add-item")
  public ResponseEntity<ChecklistItemDTO> addItem(
    @RequestBody ChecklistItemDTO checklistItemDTO
  ) {
    try {
      ChecklistItemDTO result = checklistService.addItem(checklistItemDTO);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
