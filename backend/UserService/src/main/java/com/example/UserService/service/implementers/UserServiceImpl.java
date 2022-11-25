package com.example.UserService.service.implementers;

import com.example.UserService.config.JwtTokenProvider;
import com.example.UserService.config.RestTemplateClient;
import com.example.UserService.dto.request.ChangePwdRequestDTO;
import com.example.UserService.dto.request.PasswordResetRequestDTO;
import com.example.UserService.dto.response.UserDetailResponseDTO;
import com.example.UserService.entity.Provider;
import com.example.UserService.entity.Role;
import com.example.UserService.entity.User;
import com.example.UserService.entity.UserStatus;
import com.example.UserService.repository.UserRepository;
import com.example.UserService.service.interfaces.UserService;

import com.example.UserService.utils.MailSenderManager;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static java.util.Arrays.asList;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RestTemplateClient restTemplateClient;
    @Autowired
    ModelMapper mapper;

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
//        try {
            restTemplateClient.restTemplate();

            List<ServiceInstance> instances = discoveryClient.getInstances("upload-service");

            ServiceInstance instance =  instances.get(0);

            log.info(String.valueOf(instance.getUri()));
            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> requestMap = new LinkedMultiValueMap<>();
        try {
            requestMap.add("File",new ByteArrayResource(file.getBytes()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        requestMap.add("Path","tripplanner/img");

            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(requestMap,headers);
            log.info(instance.getUri()+"/upload/api/upload/add");
        ResponseEntity<String> a =restTemplateClient.restTemplate().postForEntity(instance.getUri()+"/upload/api/upload/add", request, String.class);

            String oldAvatar = user.getAvatar();
            if (oldAvatar != null){
                HttpHeaders header = new HttpHeaders();
                headers.setAccept(asList(MediaType.APPLICATION_JSON));
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                MultiValueMap<String, Object> requestMapDelete = new LinkedMultiValueMap<>();
                requestMapDelete.add("Path","tripplanner/img");
                HttpEntity<MultiValueMap<String, Object>> deleteRequest =
                        new HttpEntity<>(requestMapDelete,header);

                restTemplateClient.restTemplate().postForObject(instance.getUri()+"/upload/api/upload/delete",header, String.class);
            }
//        } catch (Exception e) {
//            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
//        } finally {
//            userRepository.updateAvatar(userId, webViewLink);
//
//        }

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
    public boolean requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null){
            return false;
        }
        String token = tokenProvider.generatePasswordResetToken(user.getUserID());
        userRepository.updateResetToken(user.getUserID(), token);
        String emailContent = "http://localhost:3000/reset-password-confirm?email="+email+"&&token=" + token;
        mailSender.sendSimpleMessage(email, "Request reset password", emailContent);
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

}
