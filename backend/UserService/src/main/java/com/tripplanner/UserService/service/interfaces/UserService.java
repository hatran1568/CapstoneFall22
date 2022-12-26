package com.tripplanner.UserService.service.interfaces;

import com.tripplanner.UserService.dto.request.ChangePwdRequestDTO;
import com.tripplanner.UserService.dto.request.PasswordResetRequestDTO;
import com.tripplanner.UserService.dto.response.UserDetailResponseDTO;
import com.tripplanner.UserService.entity.Provider;
import com.tripplanner.UserService.entity.User;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;

public interface UserService {
    public void processOAuthPostLoginGoogle(String email);
    public void processOAuthPostLoginFacebook(String name);
    public void updateProvider(int userID, Provider authType);
    public void register(User user);
    public boolean checkExistByEmail(String email);
    public UserDetailResponseDTO getUserProfileById(int userId);
    public String editAvatar(int userId, MultipartFile file);
    public void editUsername(int userId, String newUsername);
    public boolean editPassword(ChangePwdRequestDTO request);
    boolean requestPasswordReset(String email) throws MessagingException;
    boolean handleResetPasswordToken(PasswordResetRequestDTO request);

//    boolean checkIsGenerating(int id);

    int getGuestId();
}
