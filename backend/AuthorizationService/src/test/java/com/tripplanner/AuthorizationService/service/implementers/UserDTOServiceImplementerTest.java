package com.tripplanner.AuthorizationService.service.implementers;

import static com.tripplanner.AuthorizationService.entity.Provider.LOCAL;
import static com.tripplanner.AuthorizationService.entity.UserStatus.ACTIVE;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

import com.tripplanner.AuthorizationService.dto.UserDTO;
import com.tripplanner.AuthorizationService.entity.Role;
import com.tripplanner.AuthorizationService.entity.User;
import com.tripplanner.AuthorizationService.entity.reppository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class UserDTOServiceImplementerTest {

  @Autowired
  private UserDTOServiceImplementer service;

  @MockBean
  private UserRepository repo;

  @Nested
  class LoadUserByEmailTest {

    @Test
    void existingUserCase() throws Exception {
      User user = new User();
      user.setUserID(1);
      user.setEmail("123@user.com");
      user.setPassword("123");
      user.setStatus(ACTIVE);
      user.setRole(new Role(2, "User"));
      user.setProvider(LOCAL);
      doReturn(user).when(repo).findByEmail(user.getEmail());

      User returnedUser = repo.findByEmail("123@user.com");
      UserDTO returnedDto = service.loadUserByEmail("123@user.com");

      Assertions.assertSame(returnedDto.getUser(), user);
      Assertions.assertSame(returnedUser, user);
    }

    @Test
    void nonExistingUserCase() {
      User returnedUser = repo.findByEmail("123@user.com");

      Assertions.assertNull(returnedUser);
      Assertions.assertThrows(
        Exception.class,
        () -> {
          service.loadUserByEmail("123@user.com");
        }
      );
    }
  }

  @Nested
  class LoadUserByIdTest {

    @Test
    void existingUserCase() {
      User user = new User();
      user.setUserID(1);
      user.setEmail("123@user.com");
      user.setPassword("123");
      user.setStatus(ACTIVE);
      user.setRole(new Role(2, "User"));
      user.setProvider(LOCAL);
      when(repo.findById(user.getUserID())).thenReturn(Optional.of(user));

      Optional<User> returnedUser = repo.findById(1);
      UserDTO returnedDto = service.loadUserById(1);

      Assertions.assertSame(returnedDto.getUser(), user);
      Assertions.assertTrue(returnedUser.isPresent());
      Assertions.assertSame(returnedUser.get(), user);
    }

    @Test
    void nonExistingUserCase() {
      Optional<User> returnedUser = repo.findById(1);

      Assertions.assertFalse(returnedUser.isPresent());
      Assertions.assertThrows(
        Exception.class,
        () -> {
          service.loadUserById(1);
        }
      );
    }
  }

  @Nested
  class LoadUserByUsernameTest {

    @Test
    void existingUserCase() {
      User user = new User();
      user.setUserID(1);
      user.setEmail("123@user.com");
      user.setPassword("123");
      user.setStatus(ACTIVE);
      user.setRole(new Role(2, "User"));
      user.setProvider(LOCAL);
      doReturn(user).when(repo).findByEmail(user.getEmail());

      User returnedUser = repo.findByEmail("123@user.com");
      UserDTO returnedDto = (UserDTO) service.loadUserByUsername(
        "123@user.com"
      );

      Assertions.assertSame(returnedDto.getUser(), user);
      Assertions.assertSame(returnedUser, user);
    }

    @Test
    void nonExistingUserCase() {
      User returnedUser = repo.findByEmail("123@user.com");

      Assertions.assertNull(returnedUser);
      Assertions.assertThrows(
        Exception.class,
        () -> {
          service.loadUserByUsername("123@user.com");
        }
      );
    }
  }
}
