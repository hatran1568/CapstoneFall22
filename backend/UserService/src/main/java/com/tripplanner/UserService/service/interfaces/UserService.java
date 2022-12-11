package com.tripplanner.UserService.service.interfaces;

import com.tripplanner.UserService.dto.request.ChangePwdRequestDTO;
import com.tripplanner.UserService.dto.request.PasswordResetRequestDTO;
import com.tripplanner.UserService.dto.response.UserDetailResponseDTO;
import com.tripplanner.UserService.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    //    public void processOAuthPostLoginGoogle(String email);
//    public void processOAuthPostLoginFacebook(String name);
//    public void updateProvider(int usernID, Provider authType);
    void register(User user);

    boolean checkExistByEmail(String email);

    UserDetailResponseDTO getUserProfileById(int userId);

    String editAvatar(int userId, MultipartFile file);

    void editUsername(int userId, String newUsername);

    boolean editPassword(ChangePwdRequestDTO request);

    boolean requestPasswordReset(String email);

    boolean handleResetPasswordToken(PasswordResetRequestDTO request);

//    boolean checkIsGenerating(int id);

    int getGuestId();
}
