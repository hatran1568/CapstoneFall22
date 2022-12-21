package com.tripplanner.UserService.service.implementers;

import com.tripplanner.UserService.config.JwtTokenProvider;
import com.tripplanner.UserService.dto.request.ChangePwdRequestDTO;
import com.tripplanner.UserService.dto.request.PasswordResetRequestDTO;
import com.tripplanner.UserService.dto.response.UserDetailResponseDTO;
import com.tripplanner.UserService.entity.Role;
import com.tripplanner.UserService.entity.User;
import com.tripplanner.UserService.repository.UserRepository;
import com.tripplanner.UserService.utils.GoogleDriveManager;
import com.tripplanner.UserService.utils.MailSenderManager;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.FileInputStream;

import static com.tripplanner.UserService.entity.Provider.LOCAL;
import static com.tripplanner.UserService.entity.UserStatus.ACTIVE;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceImplTest {
    @Autowired
    private UserServiceImpl service;

    @MockBean
    private UserRepository userRepo;

    @MockBean
    private JwtTokenProvider provider;

    @MockBean
    private MailSenderManager mailSender;

    @MockBean
    private GoogleDriveManager driveManager;

    @Test
    void registerTest() {
        User user = new User();
        user.setUserID(1);
        user.setEmail("123@user.com");
        user.setPassword(new BCryptPasswordEncoder().encode("123"));
        user.setStatus(ACTIVE);
        user.setRole(new Role(2, "User"));
        user.setProvider(LOCAL);
        doReturn(user).when(userRepo).save(user);

        service.register(user);

        verify(userRepo, times(1)).save(user);
    }

    @Test
    void editUsernameTest() {
        User user = new User();
        user.setUserID(1);
        user.setName("123");
        doNothing().when(userRepo).updateUsername(user.getUserID(), "abc");

        service.editUsername(1, "abc");

        verify(userRepo, times(1)).updateUsername(1, "abc");
    }

    @Test
    void editAvatarTest() throws Exception {
        User user = new User();
        user.setUserID(1);
        user.setAvatar("id=1234");
        doReturn(user).when(userRepo).findByUserID(1);
        FileInputStream fis = new FileInputStream("src/test/java/com/tripplanner/UserService/service/implementers/test.jpg");
        MockMultipartFile file = new MockMultipartFile("avatar", fis);
        doReturn("").when(driveManager).uploadFile(file, "tripplanner/img");
        String oldImg = user.getAvatar();
        doNothing().when(driveManager).deleteFile(oldImg.split("id=")[1]);
        doNothing().when(userRepo).updateAvatar(1, "");

        String returned = service.editAvatar(1, file);

        Assertions.assertEquals(returned.split("id=")[1], "1234");
    }

    @Nested
    class CheckExistByEmailTest {
        @Test
        void existingEmailCase() {
            User user = new User();
            user.setEmail("123@user.com");
            doReturn(user).when(userRepo).findByEmail(user.getEmail());

            boolean returnedCheck = service.checkExistByEmail("123@user.com");

            Assertions.assertTrue(returnedCheck);
        }

        @Test
        void nonExistingEmailCase() {
            boolean returnedCheck = service.checkExistByEmail("123@user.com");

            Assertions.assertFalse(returnedCheck);
        }
    }

    @Nested
    class GetUserProfileByIdTest {
        @Test
        void existingUserCase() {
            User user = new User();
            user.setUserID(1);
            user.setEmail("123@user.com");
            user.setPassword(new BCryptPasswordEncoder().encode("123"));
            user.setStatus(ACTIVE);
            user.setRole(new Role(2, "User"));
            user.setProvider(LOCAL);
            doReturn(user).when(userRepo).findByUserID(user.getUserID());

            User returnedUser = userRepo.findByUserID(1);
            UserDetailResponseDTO returnedDto = service.getUserProfileById(1);

            Assertions.assertSame(returnedUser, user);
            Assertions.assertSame(returnedDto.getUserID(), user.getUserID());
        }

        @Test
        void nonExistingUserCase() {
            User returnedUser = userRepo.findByUserID(1);
            UserDetailResponseDTO returnedDto = service.getUserProfileById(1);

            Assertions.assertNull(returnedUser);
            Assertions.assertNull(returnedDto);
        }
    }

    @Nested
    class EditPasswordTest {
        @Test
        void validPasswordCase() {
            User user = new User();
            user.setUserID(1);
            user.setPassword(new BCryptPasswordEncoder().encode("123"));
            ChangePwdRequestDTO dto = new ChangePwdRequestDTO();
            dto.setId(1);
            dto.setOldPassword("123");
            dto.setNewPassword("234");
            doReturn(user).when(userRepo).findByUserID(dto.getId());
            doNothing().when(userRepo).updatePassword(
                    dto.getId(),
                    new BCryptPasswordEncoder().encode(dto.getNewPassword())
            );

            boolean returnedCheck = service.editPassword(dto);

            Assertions.assertTrue(returnedCheck);
        }

        @Test
        void invalidPasswordCase() {
            User user = new User();
            user.setUserID(1);
            user.setPassword(new BCryptPasswordEncoder().encode("123"));
            ChangePwdRequestDTO dto = new ChangePwdRequestDTO();
            dto.setId(1);
            dto.setOldPassword("1234");
            dto.setNewPassword("234");
            doReturn(user).when(userRepo).findByUserID(user.getUserID());
            doNothing().when(userRepo).updatePassword(
                    dto.getId(),
                    new BCryptPasswordEncoder().encode(dto.getNewPassword())
            );

            boolean returnedCheck = service.editPassword(dto);

            Assertions.assertFalse(returnedCheck);
        }
    }

    @Nested
    class RequestChangePasswordTest {
        @Test
        void validEmailCase() {
            User user = new User();
            user.setUserID(1);
            user.setEmail("123@user.com");
            user.setPassword(new BCryptPasswordEncoder().encode("123"));
            doReturn(user).when(userRepo).findByEmail(user.getEmail());
            String token = doReturn("mock-token")
                    .when(provider)
                    .generatePasswordResetToken(user.getUserID());
            doNothing().when(userRepo).updateResetToken(user.getUserID(), token);
            String email = "http://localhost:3000/reset-password-confirm?email=" + user.getEmail() + "&&token=" + token;
            doNothing().when(mailSender).sendSimpleMessage(user.getEmail(), "Request reset password", email);

            boolean returnedCheck = service.requestPasswordReset("123@user.com");

            Assertions.assertTrue(returnedCheck);
        }

        @Test
        void invalidEmailCase() {
            boolean returnedCheck = service.requestPasswordReset("123@user.com");

            Assertions.assertFalse(returnedCheck);
        }
    }

    @Nested
    class HandleResetPasswordTokenTest {
        @Test
        void validRequestCase() {
            User user = new User();
            user.setUserID(1);
            user.setEmail("123@user.com");
            user.setPassword(new BCryptPasswordEncoder().encode("123"));
            PasswordResetRequestDTO dto = new PasswordResetRequestDTO();
            dto.setEmail("123@user.com");
            dto.setResetToken("dummy-token");
            dto.setNewPassword("234");
            doReturn(user).when(userRepo).findByEmail(dto.getEmail());
            doReturn(true).when(provider).validateToken(dto.getResetToken());
            doNothing().when(userRepo).updatePassword(
                    user.getUserID(),
                    new BCryptPasswordEncoder().encode(dto.getNewPassword())
            );

            boolean returnedCheck = service.handleResetPasswordToken(dto);

            Assertions.assertTrue(returnedCheck);
        }

        @Test
        void invalidEmailCase() {
            PasswordResetRequestDTO dto = new PasswordResetRequestDTO();
            dto.setEmail("123@user.com");
            dto.setResetToken("dummy-token");
            dto.setNewPassword("234");

            boolean returnedCheck = service.handleResetPasswordToken(dto);

            Assertions.assertFalse(returnedCheck);
        }

        @Test
        void invalidTokenCase() {
            User user = new User();
            user.setUserID(1);
            user.setEmail("123@user.com");
            user.setPassword(new BCryptPasswordEncoder().encode("123"));
            PasswordResetRequestDTO dto = new PasswordResetRequestDTO();
            dto.setEmail("123@user.com");
            dto.setResetToken("dummy-token");
            dto.setNewPassword("234");
            doReturn(user).when(userRepo).findByEmail(dto.getEmail());
            doReturn(false).when(provider).validateToken(dto.getResetToken());

            boolean returnedCheck = service.handleResetPasswordToken(dto);

            Assertions.assertFalse(returnedCheck);
        }
    }

    @Nested
    class GetGuestIdTest {
        @Test
        void existingGuest() {
            User user = new User();
            user.setUserID(1);
            doReturn(user.getUserID()).when(userRepo).findGuestUser();

            int returnedId = service.getGuestId();

            Assertions.assertEquals(returnedId, user.getUserID());
        }

        @Test
        void nonExistingGuest() {
            User user = new User();
            user.setUserID(1);
            doReturn(null).when(userRepo).findGuestUser();
            doReturn(user).when(userRepo).save(any());

            int returnedId = service.getGuestId();

            Assertions.assertEquals(returnedId, 1);
        }
    }
}