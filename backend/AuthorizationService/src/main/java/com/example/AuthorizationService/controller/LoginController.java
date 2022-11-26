package com.example.AuthorizationService.controller;

import com.example.AuthorizationService.dto.UserDTO;
import com.example.AuthorizationService.dto.request.LoginRequestDTO;
import com.example.AuthorizationService.dto.response.ConnValidationResponse;
import com.example.AuthorizationService.dto.response.LoginResponseDTO;
import com.example.AuthorizationService.entity.User;
import com.example.AuthorizationService.entity.reppository.UserRepository;
import com.example.AuthorizationService.security.JwtTokenProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/auth/api"  )
public class LoginController {
    @Autowired
    JwtTokenProvider tokenProvider;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AuthenticationManager authenticationManager;
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @RequestMapping(value = "/login", produces = { "*/*" }, method = RequestMethod.POST)
    public String authenticateUser(@RequestBody LoginRequestDTO loginRequest) {

        // Xác thực thông tin người dùng Request lên
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken((UserDTO) authentication.getPrincipal());
        UserDTO userDTO = (UserDTO) authentication.getPrincipal();
        User user = userRepository.findByUserID(userDTO.getUser().getUserID());
        LoginResponseDTO responseDTO = new LoginResponseDTO(jwt,user.getRole().getRoleName(),user.getUserID());
        try {
            return new ObjectMapper().writeValueAsString(new LoginResponseDTO(jwt,user.getRole().getRoleName(), user.getUserID()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @RequestMapping(value = "/api/loginByOAuth", produces = { "*/*" }, method = RequestMethod.POST)
    public String authenticateUserOAuth(String jwt) {
        return jwt;
    }
    @RequestMapping(value = "/test",produces = { "*/*" },method = RequestMethod.POST)
    public String abc(){
        return  "avac";
    }
    @RequestMapping(value = "/wrongUser",produces = {"*/*"},method = RequestMethod.GET)
    public ResponseEntity returnWrongUser(){
        return new ResponseEntity( HttpStatus.FORBIDDEN);
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping(value = "", produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ConnValidationResponse> validateGet(HttpServletRequest request) {
        String username = (String) request.getAttribute("username");
        List<GrantedAuthority> grantedAuthorities = (List<GrantedAuthority>) request.getAttribute("authorities");
        return ResponseEntity.ok(ConnValidationResponse.builder().status("OK").methodType(HttpMethod.GET.name())
                .username(username).authorities(grantedAuthorities)
                .isAuthenticated(true).build());
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping(value = "checkValid/{jwt}")
    public ResponseEntity<Boolean> checkJwt(@PathVariable String jwt){
        return  new ResponseEntity<Boolean>(tokenProvider.checkValid(jwt),HttpStatus.OK);
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping(value = "getAuthentication/{jwt}")
    public ResponseEntity<String> getAuthen(@PathVariable String jwt){
        return new ResponseEntity<String>(tokenProvider.getAuthen(jwt),HttpStatus.OK);
    }
}
