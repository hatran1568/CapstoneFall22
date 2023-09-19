package com.planner.backendserver.DTO;

import com.planner.backendserver.entity.Role;
import java.util.Collection;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class OAuth2UserDTO implements OAuth2User {

  private OAuth2User oAuth2User;
  private String clientName;

  public OAuth2UserDTO(OAuth2User user) {
    oAuth2User = user;
  }

  public OAuth2UserDTO(OAuth2User user, String clientName) {
    oAuth2User = user;
    this.clientName = clientName;
  }

  @Override
  public Map<String, Object> getAttributes() {
    return oAuth2User.getAttributes();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return oAuth2User.getAuthorities();
  }

  @Override
  public String getName() {
    return oAuth2User.getAttribute("name");
  }

  public String getEmail() {
    return oAuth2User.<String>getAttribute("email");
  }

  public int getUserId() {
    return Integer.parseInt(oAuth2User.<String>getAttribute("id"));
  }

  public Role getRole() {
    return oAuth2User.<Role>getAttribute("role");
  }

  public String getClientName() {
    return this.clientName;
  }
}
