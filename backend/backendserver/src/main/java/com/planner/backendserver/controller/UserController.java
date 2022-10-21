package com.planner.backendserver.controller;

import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/findById/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id){
        if (userService.getUserProfileById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userService.getUserProfileById(id), HttpStatus.OK);
    }

}
