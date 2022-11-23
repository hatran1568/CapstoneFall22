package com.example.TripService.controller;

import com.example.TripService.dto.response.ChecklistItemDTO;
import com.example.TripService.service.interfaces.ChecklistService;
import com.fasterxml.jackson.databind.node.ObjectNode;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("trip/api/checklist")
public class ChecklistController {
    @Autowired
    private ChecklistService checklistService;

    @GetMapping("/get-by-trip")
    public ResponseEntity<List<ChecklistItemDTO>> getChecklistItemsByTripId(@RequestParam int tripId){
        try{
            return new ResponseEntity<>(checklistService.getChecklistItemsByTripId(tripId), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/toggle-checked")
    public ResponseEntity<?> updateCheckedState(@RequestBody ObjectNode request){
        try{
            int itemId = request.get("itemId").asInt();
            Boolean checked = request.get("checked").asBoolean();
            if (!checklistService.itemExists(itemId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            checklistService.updateCheckedState(itemId, checked);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/delete-item")
    public ResponseEntity<?> deleteItem(@RequestBody ObjectNode objectNode){
        try{
            int itemId = objectNode.get("itemId").asInt();
            checklistService.deleteItemById(itemId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/put-item")
    public ResponseEntity<ChecklistItemDTO> editTripDetail(@RequestBody ChecklistItemDTO newItem, @RequestParam int id){
        try{
            ChecklistItemDTO item = checklistService.editItemById(newItem,id);
            if (item==null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(item, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/add-item")
    public ResponseEntity<ChecklistItemDTO> addItem(@RequestBody ChecklistItemDTO checklistItemDTO){
        try{
            ChecklistItemDTO result = checklistService.addItem(checklistItemDTO);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
