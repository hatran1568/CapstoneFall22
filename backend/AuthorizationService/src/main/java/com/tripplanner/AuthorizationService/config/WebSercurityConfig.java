package com.tripplanner.AuthorizationService.config;


import com.tripplanner.AuthorizationService.dto.OAuth2UserDTO;
import com.tripplanner.AuthorizationService.entity.User;
import com.tripplanner.AuthorizationService.entity.reppository.UserRepository;
import com.tripplanner.AuthorizationService.security.JwtAuthenticationFilter;
import com.tripplanner.AuthorizationService.security.JwtTokenProvider;
import com.tripplanner.AuthorizationService.service.implementers.UserDTOServiceImplementer;
import com.tripplanner.AuthorizationService.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSercurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    OAuth2UserService oAuth2User;
    @Autowired
    UserDTOServiceImplementer userDTOService;
    @Autowired
    JwtTokenProvider tokenProvider;
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Password encoder, để Spring Security sử dụng mã hóa mật khẩu người dùng
        return new BCryptPasswordEncoder();
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth.userDetailsService(userDTOService) // Cung cáp userservice cho spring security
                .passwordEncoder(passwordEncoder()); // cung cấp password encoder
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // Get AuthenticationManager Bean
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().configurationSource(request -> {
                    var cors = new CorsConfiguration();
                    cors.setAllowedOrigins(List.of("http://localhost:3000/"));
                    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    cors.setAllowedHeaders(List.of("Authorization",
                            "Content-Type",
                            "X-Requested-With",
                            "Accept",
                            "X-XSRF-TOKEN"));
                    cors.setAllowCredentials(true);
                    return cors;
                })
                .and()
                .csrf()
                .disable()
                .authorizeRequests()


                .antMatchers("/auth/**", "/api/register", "/login", "/oauth/**", "/api/loginByOAuth", "/api/wrongUser", "/api/user/findById/**", "/search/**", "/trip/**", "/trip/put-detail", "/api/pois/**", "/api/destination/**", "/api/expense/**", "/api/blog/**", "/api/user/password-reset", "/api/user/password-reset-request", "/trip/generate", "/api/collection/**", "/api/checklist/**", "/api/user/**", "/api/request/**", "api/admin/**").permitAll()


                .anyRequest().authenticated().and().formLogin().loginPage("/api/wrongUser").failureHandler(new AuthenticationFailureHandler() {

                    @Override
                    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                                        AuthenticationException exception) throws IOException, ServletException {


                        response.sendRedirect("/api/wrongUser");
                    }
                })
                .permitAll();
        http.oauth2Login()

                .userInfoEndpoint()
                .userService(oAuth2User)
                .and().failureHandler(new AuthenticationFailureHandler() {

                    @Override
                    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                                        AuthenticationException exception) throws IOException, ServletException {


                        response.getWriter().write("failed");
                        response.setStatus(403);
                    }
                })
                .successHandler(new AuthenticationSuccessHandler() {

                    @Override
                    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                        Authentication authentication) throws IOException, ServletException {

                        OAuth2UserDTO oauthUser = (OAuth2UserDTO) authentication.getPrincipal();
                        String oauth2ClientName = oauthUser.getClientName();

                        String username = oauthUser.getEmail();
                        if (oauth2ClientName.equalsIgnoreCase("google")) {
                            userService.processOAuthPostLoginGoogle(oauthUser.getEmail());
                            String jwt = tokenProvider.generateToken(oauthUser);
                            User user = userRepository.findByEmail(oauthUser.getEmail());
                            String uri = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect")


                                    .queryParam("token", jwt)
                                    .queryParam("role", user.getRole().getRoleName())
                                    .queryParam("id", user.getUserID())
                                    .build().toUriString();
                            response.sendRedirect(uri);
                        }
                        if (oauth2ClientName.equalsIgnoreCase("facebook")) {
                            userService.processOAuthPostLoginFacebook(oauthUser.getEmail());
                            String jwt = tokenProvider.generateToken(oauthUser);
                            User user = userRepository.findByEmail(oauthUser.getEmail());
                            String uri = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect")

                                    .queryParam("token", jwt)
                                    .queryParam("role", user.getRole().getRoleName())
                                    .queryParam("id", user.getUserID())
                                    .build().toUriString();
                            response.sendRedirect(uri);
                        }


                    }
                });
        // Thêm một lớp Filter kiểm tra jwt
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    }


}