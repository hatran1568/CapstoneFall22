package com.planner.backendserver.service;

import com.planner.backendserver.dto.response.UserDetailResponseDTO;
import com.planner.backendserver.entity.Provider;
import com.planner.backendserver.entity.Role;
import com.planner.backendserver.entity.User;
import com.planner.backendserver.entity.UserStatus;
import com.planner.backendserver.repository.UserRepository;
import com.planner.backendserver.service.interfaces.UserService;
import org.hibernate.annotations.SQLInsert;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplementer implements UserService  {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper mapper;



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


    @Override
    public void register(User user) {

        userRepository.save(user);
    }

    @Override
    public boolean checkExistByEmail(String email) {
        User check = userRepository.findByEmail(email);
        if(check==null)
            return false;
        else return true;
    }

    @Override
    public UserDetailResponseDTO getUserProfileById(int userId) {
        User user = userRepository.findByUserID(userId);
        if (user == null){
            return null;
        }
        UserDetailResponseDTO userDTO = mapper.map(user, UserDetailResponseDTO.class);
        return userDTO;
    }
}
