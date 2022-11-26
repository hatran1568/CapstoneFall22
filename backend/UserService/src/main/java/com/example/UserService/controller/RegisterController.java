package com.example.UserService.controller;

import com.example.UserService.dto.request.RegisterRequestDTO;
import com.example.UserService.entity.Provider;
import com.example.UserService.entity.Role;
import com.example.UserService.entity.User;
import com.example.UserService.service.interfaces.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/api"  )

public class RegisterController {
    @Autowired
    UserService userService;
    @RequestMapping(value = "/register", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity authenticateUser(@RequestBody RegisterRequestDTO registerRequest) {
        try{
            User user = new User();
            user.setEmail(registerRequest.getEmail());
            user.setName(registerRequest.getUsername());
            user.setPassword(new BCryptPasswordEncoder().encode(registerRequest.getPassword()));
            user.setRole(new Role(2,"User"));
            user.setProvider(Provider.LOCAL);
            if(userService.checkExistByEmail(user.getEmail())==true){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            else{
                userService.register(user);
                return  new ResponseEntity(HttpStatus.OK);
            }

        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
