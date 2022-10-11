package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.dto.response.UserDetailResponseDTO;
import com.planner.backendserver.entity.Provider;
import com.planner.backendserver.entity.User;

public interface UserService {
    public void processOAuthPostLoginGoogle(String email);
    public void processOAuthPostLoginFacebook(String name);
    public void updateProvider(int usernID, Provider authType);
    public void register(User user);
    public boolean checkExistByEmail(String email);
    public UserDetailResponseDTO getUserProfileById(int userId);
}
