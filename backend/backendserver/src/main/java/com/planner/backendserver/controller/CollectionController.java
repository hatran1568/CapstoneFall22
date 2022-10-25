package com.planner.backendserver.controller;

import com.planner.backendserver.entity.Collection;
import com.planner.backendserver.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/collection")
public class CollectionController {
    @Autowired
    private CollectionRepository collectionRepository;

    @GetMapping("/{uid}")
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


}
