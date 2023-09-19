package com.tripplanner.AuthorizationService.service.implementers;

import static com.tripplanner.AuthorizationService.entity.Provider.FACEBOOK;
import static com.tripplanner.AuthorizationService.entity.Provider.GOOGLE;
import static com.tripplanner.AuthorizationService.entity.UserStatus.ACTIVE;
import static org.mockito.Mockito.*;

import com.tripplanner.AuthorizationService.entity.Role;
import com.tripplanner.AuthorizationService.entity.User;
import com.tripplanner.AuthorizationService.entity.reppository.UserRepository;
import com.tripplanner.AuthorizationService.service.interfaces.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class UserServiceImplementerTest {

  @Autowired
  private UserService service;

  @MockBean
  private UserRepository repo;

  @BeforeEach
  void setUp() {}

  @Nested
  class ProcessOAuthPostLoginGoogleTest {

    @Test
    void existingUserCase() {
      User user = new User();
      user.setUserID(1);
      user.setEmail("123@user.com");
      user.setPassword("123");
      user.setStatus(ACTIVE);
      user.setRole(new Role(2, "User"));
      user.setProvider(GOOGLE);
      doReturn(user).when(repo).findByEmail(user.getEmail());

      service.processOAuthPostLoginGoogle("123@user.com");

      verify(repo, times(1)).findByEmail("123@user.com");
      verify(repo, times(0)).save(any());
    }

    @Test
    void newUserCase() {
      service.processOAuthPostLoginGoogle("123@user.com");
      verify(repo, times(1)).findByEmail("123@user.com");
      verify(repo, times(1)).save(any());
    }
  }

  @Nested
  class ProcessOAuthPostLoginFacebookTest {

    @Test
    void existingUserCase() {
      User user = new User();
      user.setUserID(1);
      user.setEmail("123@user.com");
      user.setPassword("123");
      user.setStatus(ACTIVE);
      user.setRole(new Role(2, "User"));
      user.setProvider(FACEBOOK);
      doReturn(user).when(repo).findByEmail(user.getEmail());

      service.processOAuthPostLoginFacebook("123@user.com");

      verify(repo, times(1)).findByEmail("123@user.com");
      verify(repo, times(0)).save(any());
    }

    @Test
    void newUserCase() {
      service.processOAuthPostLoginFacebook("123@user.com");
      verify(repo, times(1)).findByEmail("123@user.com");
      verify(repo, times(1)).save(any());
    }
  }
}
