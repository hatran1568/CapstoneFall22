package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.dto.request.ChangePwdRequestDTO;
import com.planner.backendserver.dto.response.UserDetailResponseDTO;
import com.planner.backendserver.entity.Provider;
import com.planner.backendserver.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    public void processOAuthPostLoginGoogle(String email);
    public void processOAuthPostLoginFacebook(String name);
    public void updateProvider(int usernID, Provider authType);
    public void register(User user);
    public boolean checkExistByEmail(String email);
    public UserDetailResponseDTO getUserProfileById(int userId);
    public String editAvatar(int userId, MultipartFile file);
    public void editUsername(int userId, String newUsername);
    public boolean editPassword(ChangePwdRequestDTO request);
}
