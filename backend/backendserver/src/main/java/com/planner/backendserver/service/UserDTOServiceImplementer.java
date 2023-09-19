package com.planner.backendserver.service;

import com.planner.backendserver.DTO.UserDTO;
import com.planner.backendserver.entity.User;
import com.planner.backendserver.repository.UserRepository;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDTOServiceImplementer implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  public UserDTO loadUserByEmail(String email) throws Exception {
    User user = userRepository.findByEmail(email);
    if (user == null) {
      throw new Exception();
    }
    return new UserDTO(user);
  }

  @Transactional
  public UserDTO loadUserById(int id) {
    User user = userRepository
      .findById(id)
      .orElseThrow(() ->
        new UsernameNotFoundException("User not found with id : " + id)
      );

    return new UserDTO(user);
  }

  @Override
  public UserDetails loadUserByUsername(String email)
    throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email);
    if (user == null) {
      throw new UsernameNotFoundException(
        "User not found with email : " + email
      );
    }
    return new UserDTO(user);
  }
}
