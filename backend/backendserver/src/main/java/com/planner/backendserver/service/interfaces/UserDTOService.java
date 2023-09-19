package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.UserDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

public interface UserDTOService {
  public UserDTO loadUserByEmail(String email) throws Exception;

  public UserDTO loadUserById(int id);
}
