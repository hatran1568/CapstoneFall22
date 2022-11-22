package com.planner.backendserver.controller;

import com.planner.backendserver.repository.UserRepository;
import com.planner.backendserver.service.implementers.UserServiceImplementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

@WebMvcTest(controllers = UserController.class)
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserServiceImplementer userService;

    @MockBean
    private UserRepository userRepository;
}