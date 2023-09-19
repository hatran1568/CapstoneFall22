package com.tripplanner.AuthorizationService.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

@Data
@Builder
public class ConnValidationResponse {

  private String status;
  private boolean isAuthenticated;
  private String methodType;
  private String username;
  private List<GrantedAuthority> authorities;
  private String token;
}
