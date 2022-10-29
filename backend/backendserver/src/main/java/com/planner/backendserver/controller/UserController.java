package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.planner.backendserver.dto.request.ChangePwdRequestDTO;
import com.planner.backendserver.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

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

    @PostMapping("/edit-avatar/{userId}")
    public ResponseEntity<?> updateAvatar(@PathVariable int userId, @RequestPart("File") MultipartFile file){
        try{
            if (userService.getUserProfileById(userId) == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            String oldAvatar = userService.editAvatar(userId, file);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/edit-username")
    public ResponseEntity<?> updateUsername(@RequestBody ObjectNode request){
        try{
            int id = request.get("id").asInt();
            String newName = request.get("username").asText();
            if (userService.getUserProfileById(id) == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            userService.editUsername(id, newName);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/edit-password")
    public ResponseEntity<?> updatePassword(@RequestBody ChangePwdRequestDTO request){
        try{

            if (userService.getUserProfileById(request.getId()) == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            boolean result = userService.editPassword(request);
            if (result == false){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<>(HttpStatus.OK);
            }
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
