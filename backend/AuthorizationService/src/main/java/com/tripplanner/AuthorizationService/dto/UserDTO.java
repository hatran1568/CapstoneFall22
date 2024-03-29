package com.tripplanner.AuthorizationService.dto;

import com.tripplanner.AuthorizationService.entity.Role;
import com.tripplanner.AuthorizationService.entity.User;
import java.util.Collection;
import java.util.Collections;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@AllArgsConstructor
public class UserDTO implements UserDetails {

  User user;

  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singleton(
      new SimpleGrantedAuthority(user.getRole().getRoleName())
    );
  }

  public String getPassword() {
    return user.getPassword();
  }

  @Override
  public String getUsername() {
    return user.getEmail();
  }

  public String getEmail() {
    return user.getEmail();
  }

  public Role getRole() {
    return user.getRole();
  }

  public boolean isAccountNonExpired() {
    return true;
  }

  public boolean isAccountNonLocked() {
    return true;
  }

  public boolean isCredentialsNonExpired() {
    return true;
  }

  public boolean isEnabled() {
    return true;
  }
}
