package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.planner.backendserver.DTO.request.HotelsRequestDTO;
import com.planner.backendserver.config.JwtTokenProvider;
import com.planner.backendserver.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = HotelsRequestDTO.LoginController.class)
class LoginControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Test returnWrongUser()")
    void returnWrongUserTest() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/api/wrongUser"))
                .andExpect(status().isForbidden());
    }

    @Nested
    @DisplayName("Test authenticateUser()")
    class AuthenticateUserTest {
        @Test
        @DisplayName("TC1: User exists")
        void authenticateUserTest1() throws Exception {
            // Change the email and password values into ones of an existing user in db.
            String json = "{" +
                    "\"username\": \"123@user.com\"," +
                    "\"password\": \"123\"" +
                    "}";

            mockMvc
                    .perform(
                            MockMvcRequestBuilders
                                    .post("/api/login")
                                    .accept(MediaType.APPLICATION_JSON)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(json)
                    )
                    .andExpectAll(
                            content().contentType(MediaType.APPLICATION_JSON),
                            jsonPath("$.role").value("User"),
                            jsonPath("$.id").value("1"),
                            status().isOk()
                    );
        }

        @Test
        @DisplayName("TC2: User doesn't exist")
        void authenticateUserTest2() throws Exception {
            // Change the email and password values into ones of a non-existing user in db.
            String json = "{" +
                    "\"username\": \"123@user.com\"," +
                    "\"password\": \"1234\"" +
                    "}";

            mockMvc
                    .perform(
                            MockMvcRequestBuilders
                                    .post("/api/login")
                                    .accept(MediaType.APPLICATION_JSON)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(json)
                    )
                    .andExpectAll(status().is3xxRedirection());
        }
    }
}