package com.tripplanner.AuthorizationService.service.implementers;

import com.tripplanner.AuthorizationService.entity.Provider;
import com.tripplanner.AuthorizationService.entity.Role;
import com.tripplanner.AuthorizationService.entity.User;
import com.tripplanner.AuthorizationService.entity.UserStatus;
import com.tripplanner.AuthorizationService.entity.reppository.UserRepository;
import com.tripplanner.AuthorizationService.security.JwtTokenProvider;
import com.tripplanner.AuthorizationService.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplementer implements UserService {

  @Autowired
  UserRepository userRepository;

  //    @Autowired
  //    ModelMapper mapper;
  //
  //    @Autowired
  //    GoogleDriveManager driveManager;

  @Autowired
  JwtTokenProvider tokenProvider;

  //    @Autowired
  //    MailSenderManager mailSender;

  @Override
  public void processOAuthPostLoginGoogle(String email) {
    User user = userRepository.findByEmail(email);
    if (user == null) {
      User newUser = new User();
      newUser.setRole(new Role(2, "User"));
      newUser.setName(email);
      newUser.setEmail(email);
      newUser.setProvider(Provider.GOOGLE);
      newUser.setStatus(UserStatus.ACTIVE);
      userRepository.save(newUser);
    }
  }

  @Override
  public void processOAuthPostLoginFacebook(String email) {
    User user = userRepository.findByEmail(email);
    if (user == null) {
      User newUser = new User();
      newUser.setRole(new Role(2, "User"));
      newUser.setName(email);
      newUser.setEmail(email);
      newUser.setProvider(Provider.FACEBOOK);
      newUser.setStatus(UserStatus.ACTIVE);
      userRepository.save(newUser);
    }
  }
  //
  //    @Override
  //    public void updateProvider(int userID, Provider authType) {
  //
  //    }
  //
  //    @Override
  //    public void register(User user) {
  //
  //    }
  //
  //    @Override
  //    public boolean checkExistByEmail(String email) {
  //        return false;
  //    }
  //
  //    @Override
  //    public String editAvatar(int userId, MultipartFile file) {
  //        return null;
  //    }
  //
  //    @Override
  //    public void editUsername(int userId, String newUsername) {
  //
  //    }
  //
  //    @Override
  //    public boolean requestPasswordReset(String email) {
  //        return false;
  //    }
}
