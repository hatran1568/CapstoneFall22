package com.tripplanner.UserService.service.implementers;

import com.tripplanner.UserService.config.JwtTokenProvider;
import com.tripplanner.UserService.config.RestTemplateClient;
import com.tripplanner.UserService.dto.request.ChangePwdRequestDTO;
import com.tripplanner.UserService.dto.request.PasswordResetRequestDTO;
import com.tripplanner.UserService.dto.response.UserDetailResponseDTO;
import com.tripplanner.UserService.entity.Provider;
import com.tripplanner.UserService.entity.Role;
import com.tripplanner.UserService.entity.User;
import com.tripplanner.UserService.entity.UserStatus;
import com.tripplanner.UserService.repository.RoleRepository;
import com.tripplanner.UserService.repository.UserRepository;
import com.tripplanner.UserService.service.interfaces.UserService;

import com.tripplanner.UserService.utils.GoogleDriveManager;
import com.tripplanner.UserService.utils.MailSenderManager;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.sql.Date;
import java.util.Calendar;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    RestTemplateClient restTemplateClient;
    @Autowired
    ModelMapper mapper;
    @Autowired
    GoogleDriveManager driveManager;
    @Autowired
    private DiscoveryClient discoveryClient;

//    @Autowired
//    GoogleDriveManager driveManager;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    MailSenderManager mailSender;

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



    //return old avatar

    @Override
    public String editAvatar(int userId, MultipartFile file) {
        User user = userRepository.findByUserID(userId);
        String webViewLink = null;
        try {
            webViewLink = driveManager.uploadFile(file, "tripplanner/img");
            String oldAvatar = user.getAvatar();
            if (oldAvatar != null){
                driveManager.deleteFile(oldAvatar.split("id=")[1]);
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        } finally {
            userRepository.updateAvatar(userId, webViewLink);

        }

        return user.getAvatar();
    }

    @Override
    public void editUsername(int userId, String newUsername) {
        userRepository.updateUsername(userId, newUsername);
    }

    @Override
    public boolean editPassword(ChangePwdRequestDTO request) {
        User user = userRepository.findByUserID(request.getId());
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(request.getOldPassword(), user.getPassword())){
            return false;
        }
        userRepository.updatePassword(request.getId(), encoder.encode(request.getNewPassword()));
        return true;
    }

    @Override
    public boolean requestPasswordReset(String email) throws MessagingException {
        User user = userRepository.findByEmail(email);
        if (user == null){
            return false;
        }
        String token = tokenProvider.generatePasswordResetToken(user.getUserID());
        userRepository.updateResetToken(user.getUserID(), token);
        String resetLink = "http://localhost:3000/reset-password-confirm?email="+email+"&&token=" + token;
        mailSender.sendSimpleMessage(email, "Forgot your password?", resetLink);
        return true;
    }

    @Override
    public boolean handleResetPasswordToken(PasswordResetRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail());
        String token = request.getResetToken();
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        if (user!=null && token.equals(request.getResetToken())){
            if (tokenProvider.validateToken(token)){
                userRepository.updatePassword(user.getUserID(),encoder.encode(request.getNewPassword()));
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean checkIsGenerating(int id) {
        if(userRepository.findByUserID(id).getRequestId()!=null){
            return true;
        }
        return false;
    }
    @Override
    public int getGuestId(){
        Integer guestId = userRepository.findGuestUser();
        if(guestId == null){
            User user = new User();
            Role role = roleRepository.getByName("Guest");
            if(role == null) role = createRole("Guest");
            user.setName("Guest");
            user.setDateCreated(new Date(Calendar.getInstance().getTime().getTime()));
            user.setRole(role);
            User saved = userRepository.save(user);
            guestId = saved.getUserID();
        }
        return guestId;
    }
    private Role createRole(String name){
        Role role = new Role();
        role.setRoleName(name);
        return roleRepository.save(role);
    }

}
