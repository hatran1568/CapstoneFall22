package com.planner.backendserver.controller;

import com.planner.backendserver.service.implementers.UserServiceImplementer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RegisterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("TC1: Success case")
    void authenticateUserTest1() throws Exception {
        // Change email to one that doesn't exist in db.
        String json = "{" +
                "\"username\": \"\"," +
                "\"email\": \"\"," +
                "\"password\": \"\"" +
                "}";

        mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/api/register")
                        .accept(MediaType.APPLICATION_JSON)
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC2: User already exists")
    void authenticateUserTest2() throws Exception {
        // Change email to an existing user in db.
        String json = "{" +
                "\"username\": \"123@user.com\"," +
                "\"email\": \"123@user.com\"," +
                "\"password\": \"123\"" +
                "}";

        mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/api/register")
                        .accept(MediaType.APPLICATION_JSON)
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}