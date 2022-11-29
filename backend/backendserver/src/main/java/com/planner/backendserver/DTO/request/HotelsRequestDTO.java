package com.planner.backendserver.DTO.request;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.planner.backendserver.DTO.UserDTO;
import com.planner.backendserver.DTO.response.LoginResponseDTO;
import com.planner.backendserver.config.JwtTokenProvider;
import com.planner.backendserver.entity.User;
import com.planner.backendserver.repository.UserRepository;
import lombok.Data;
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

@Data
public class HotelsRequestDTO {
    private int poiId;
    private int page;
    private double distance;
    private int price;
    private int rate;


}
