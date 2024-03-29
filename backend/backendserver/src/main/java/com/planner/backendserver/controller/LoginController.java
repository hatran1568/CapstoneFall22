package com.planner.backendserver.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.planner.backendserver.DTO.UserDTO;
import com.planner.backendserver.DTO.response.LoginResponseDTO;
import com.planner.backendserver.config.JwtTokenProvider;
import com.planner.backendserver.entity.User;
import com.planner.backendserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LoginController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  private JwtTokenProvider tokenProvider;

  @RequestMapping(
    value = "/login",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public String authenticateUser(
    @RequestBody com.planner.backendserver.dto.request.LoginRequestDTO loginRequest
  ) {
    // Xác thực thông tin người dùng Request lên
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        loginRequest.getUsername(),
        loginRequest.getPassword()
      )
    );
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = tokenProvider.generateToken(
      (UserDTO) authentication.getPrincipal()
    );
    UserDTO userDTO = (UserDTO) authentication.getPrincipal();
    User user = userRepository.findByUserID(userDTO.getUser().getUserID());
    LoginResponseDTO responseDTO = new LoginResponseDTO(
      jwt,
      user.getRole().getRoleName(),
      user.getUserID()
    );
    try {
      return new ObjectMapper()
        .writeValueAsString(
          new LoginResponseDTO(
            jwt,
            user.getRole().getRoleName(),
            user.getUserID()
          )
        );
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }

  @RequestMapping(
    value = "/api/loginByOAuth",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public String authenticateUserOAuth(String jwt) {
    return jwt;
  }

  @RequestMapping(
    value = "/wrongUser",
    produces = { "*/*" },
    method = RequestMethod.GET
  )
  public ResponseEntity returnWrongUser() {
    return new ResponseEntity(HttpStatus.FORBIDDEN);
  }
}
