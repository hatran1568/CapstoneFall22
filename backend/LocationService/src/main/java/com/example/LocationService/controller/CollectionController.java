package com.example.LocationService.controller;

import com.example.LocationService.dto.request.DeletePOIFromCollectionDTO;
import com.example.LocationService.dto.response.CollectionDTO;
import com.example.LocationService.dto.response.POIOfCollectionDTO;
import com.example.LocationService.entity.Collection;
import com.example.LocationService.repository.CollectionRepository;
import com.example.LocationService.service.interfaces.CollectionService;
import com.example.LocationService.service.interfaces.POIService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/poi/api/collection")
public class CollectionController {
    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private CollectionService collectionService;

    @Autowired
    private POIService poiService;

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
            ArrayList<CollectionDTO> collections = collectionService.getCollectionListByUid(uid);
            if (collections.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(collections, HttpStatus.OK);

    }

    @GetMapping("/get/{colId}")
    public ResponseEntity<CollectionDTO> getCollection(@PathVariable int colId) {
        try {
            CollectionDTO collection = collectionService.getCollectionById(colId);
            if (collection == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(collection, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // getting POI list here
    @GetMapping("/poiList/{colId}")
    public ResponseEntity<ArrayList<POIOfCollectionDTO>> getPOIList(@PathVariable int colId) {
        try {
            ArrayList<POIOfCollectionDTO> pois = collectionService.getPOIListOfCollection(colId);
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
    public ResponseEntity<ArrayList<CollectionDTO>> createNewCollection(@RequestBody ObjectNode objectNode) {
        try {
            Date dateCreated = new Date(System.currentTimeMillis());
            String description = objectNode.get("description").asText();
            boolean isDeleted = false;
            String title = objectNode.get("title").asText();
            int uid = objectNode.get("uid").asInt();
            collectionRepository.createNewCollection(dateCreated, dateCreated, description, isDeleted, title, uid);
            ArrayList<CollectionDTO> collections = collectionService.getCollectionListByUid(uid);
            return new ResponseEntity<>(collections, HttpStatus.OK);
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

    @PutMapping("/edit")
    public ResponseEntity<CollectionDTO> updateCollection(@RequestBody ObjectNode objectNode) {
        try {
            int colId = objectNode.get("id").asInt();
            String title = objectNode.get("title").asText();
            String desc = objectNode.get("description").asText();
            Date mod = new Date(System.currentTimeMillis());
            collectionRepository.updateCollectionInfo(colId, title, desc, mod);
            CollectionDTO updated = collectionService.getCollectionById(colId);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // modifying POI list here
    @PostMapping("/addPoi")
    public ResponseEntity<CollectionDTO> addPOI(@RequestBody ObjectNode objectNode) {
        try {
            int poiId = objectNode.get("poiId").asInt();
            int colId = objectNode.get("colId").asInt();
            collectionRepository.addPOIIntoCollection(poiId, colId);
            CollectionDTO collection = collectionService.getCollectionById(colId);
            return new ResponseEntity<>(collection, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deletePoi")
    public ResponseEntity<CollectionDTO> deletePOI(@RequestBody DeletePOIFromCollectionDTO dto) {
        try {
            int poiId = dto.getPoiId();
            int colId = dto.getColId();
            collectionService.deletePOIFromCollection(poiId, colId);
            CollectionDTO collection = collectionService.getCollectionById(colId);
            return new ResponseEntity<>(collection, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addPoi2")
    public ResponseEntity<ArrayList<CollectionDTO>> addPOI2(@RequestBody ObjectNode objectNode) {
        try {
            int poiId = objectNode.get("poiId").asInt();
            int colId = objectNode.get("colId").asInt();
            int uid = objectNode.get("uid").asInt();
            collectionRepository.addPOIIntoCollection(poiId, colId);
            ArrayList<CollectionDTO> collections = collectionService.getCollectionListByUid(uid);
            return new ResponseEntity<>(collections, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deletePoi2")
    public ResponseEntity<ArrayList<CollectionDTO>> deletePOI2(@RequestBody DeletePOIFromCollectionDTO dto) {
        try {
            int poiId = dto.getPoiId();
            int colId = dto.getColId();
            int uid = dto.getUid();
            collectionService.deletePOIFromCollection(poiId, colId);
            ArrayList<CollectionDTO> collections = collectionService.getCollectionListByUid(uid);
            return new ResponseEntity<>(collections, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
