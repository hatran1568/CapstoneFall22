package com.tripplanner.AuthorizationService.service.implementers;

import com.tripplanner.AuthorizationService.service.interfaces.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.web.WebAppConfiguration;

@WebAppConfiguration
@AutoConfigureMockMvc
class UserServiceImplementerTest {
    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void processOAuthPostLoginGoogleTest() {
    }
}