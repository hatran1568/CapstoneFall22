package com.planner.backendserver.service;

import com.planner.backendserver.entity.Provider;
import com.planner.backendserver.entity.Role;
import com.planner.backendserver.entity.User;
import com.planner.backendserver.entity.UserStatus;
import com.planner.backendserver.repository.UserRepository;
import com.planner.backendserver.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplementer implements UserService  {
    @Autowired
    UserRepository userRepository;





    @Override
    public void processOAuthPostLoginGoogle(String email) {
        User user = userRepository.findByEmail(email);
        if(user == null){
            User newUser = new User();
            newUser.setRole(new Role(2,"User"));
            newUser.setName(email);
            newUser.setEmail(email);
            newUser.setProvider(Provider.GOOGLE);
            newUser.setStatus(UserStatus.ACTIVE);
            userRepository.save(newUser);
        }
    }

    @Override
    public void processOAuthPostLoginFacebook(String name) {
        User user = userRepository.findByEmail(name);
        if(user == null){
            User newUser = new User();
            newUser.setRole(new Role(2,"User"));
            newUser.setName(name);
            newUser.setEmail(name);
            newUser.setProvider(Provider.FACEBOOK);
            newUser.setStatus(UserStatus.ACTIVE);
            userRepository.save(newUser);
        }
    }

    @Override
    public void updateProvider(int userID, Provider authType) {

    }
}
