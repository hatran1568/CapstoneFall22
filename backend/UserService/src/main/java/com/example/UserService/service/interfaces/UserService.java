package com.example.UserService.service.interfaces;

import com.example.UserService.dto.request.ChangePwdRequestDTO;
import com.example.UserService.dto.request.PasswordResetRequestDTO;
import com.example.UserService.dto.response.UserDetailResponseDTO;
import com.example.UserService.entity.Provider;
import com.example.UserService.entity.User;
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
    boolean requestPasswordReset(String email);
    boolean handleResetPasswordToken(PasswordResetRequestDTO request);

    boolean checkIsGenerating(int id);


}
