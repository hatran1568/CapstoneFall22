package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.planner.backendserver.DTO.CollectionDTO;
import com.planner.backendserver.entity.Collection;
import com.planner.backendserver.entity.CollectionPOI;
import com.planner.backendserver.repository.CollectionRepository;
import com.planner.backendserver.service.interfaces.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/collection")
public class CollectionController {
    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private CollectionService collectionService;

    // getting collections here
    @GetMapping("/newest")
    public ResponseEntity<Collection> getNewCollection() {
        try {
            Collection newest = collectionRepository.getNewestCollectionID();
            if (newest == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(newest, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list/{uid}")
    public ResponseEntity<ArrayList<CollectionDTO>> getCollections(@PathVariable int uid) {
        try {
            ArrayList<CollectionDTO> collections = collectionService.getCollectionListByUid(uid);
            if (collections.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(collections, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // getting POI list here
    @GetMapping("/poiList/{colId}")
    public ResponseEntity<ArrayList<CollectionPOI>> getPOIList(@PathVariable int colId) {
        try {
            ArrayList<CollectionPOI> pois = collectionRepository.getPOIListOfCollectionByID(colId);
            if (pois.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(pois, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // modifying collection list here
    @PostMapping("/create")
    public ResponseEntity<Collection> createNewCollection(@RequestBody ObjectNode objectNode) {
        try {
            Date dateCreated = new Date(System.currentTimeMillis());
            String description = objectNode.get("description").asText();
            boolean isDeleted = false;
            String title = objectNode.get("title").asText();
            int uid = objectNode.get("uid").asInt();
            collectionRepository.createNewCollection(dateCreated, dateCreated, description, isDeleted, title, uid);
            Collection newest = collectionRepository.getNewestCollectionID();
            return new ResponseEntity<>(newest, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteCollection(@RequestBody ObjectNode objectNode) {
        try {
            int colId = objectNode.get("id").asInt();
            collectionRepository.deleteCollectionById(colId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // modifying POI list here
    @PostMapping("/addPoi")
    public ResponseEntity<?> addPOI(@RequestBody ObjectNode objectNode) {
        try {
            int poiId = objectNode.get("poiId").asInt();
            int colId = objectNode.get("colId").asInt();
            collectionRepository.addPOIIntoCollection(poiId, colId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deletePoi")
    public ResponseEntity<?> deletePOI(@RequestBody ObjectNode objectNode) {
        try {
            int poiId = objectNode.get("poiId").asInt();
            int colId = objectNode.get("colId").asInt();
            collectionRepository.removePOIFromCollection(poiId, colId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updatePoi")
    public ResponseEntity<?> updatePOI(@RequestBody ObjectNode objectNode) {
        try {
            int poiId = objectNode.get("poiId").asInt();
            int colId = objectNode.get("colId").asInt();
            CollectionPOI poi = collectionRepository.getPOIFromCollection(poiId, colId);
            if (poi == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            collectionRepository.updatePOIInCollection(poiId, colId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
