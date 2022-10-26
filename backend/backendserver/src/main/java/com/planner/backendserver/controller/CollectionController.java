package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.planner.backendserver.entity.Collection;
import com.planner.backendserver.repository.CollectionRepository;
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

    @GetMapping("/user/{uid}")
    public ResponseEntity<ArrayList<Collection>> getCollectionsByUID(@PathVariable int uid) {
        try {
            ArrayList<Collection> collections = collectionRepository.getCollectionsByUserID(uid);
            if (collections.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(collections, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/detail/{uid}")
    public ResponseEntity<ArrayList<Collection>> getCollectionDetails(@PathVariable int uid) {
        try {
            ArrayList<Collection> collections = collectionRepository.getCollectionDetailsByUserID(uid);
            if (collections.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(collections, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Collection> createNewCollection(@RequestBody ObjectNode objectNode) {
        try {
            Date dateCreated = new Date(System.currentTimeMillis());
            String description = objectNode.get("description").asText();
            boolean isDeleted = false;
            String title = objectNode.get("title").asText();
            int uid = objectNode.get("uid").asInt();
            collectionRepository.createNewCollection(dateCreated, dateCreated, description, isDeleted, title, uid);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteCollection(@PathVariable int colId) {
        try {
            collectionRepository.deleteCollectionById(colId);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
