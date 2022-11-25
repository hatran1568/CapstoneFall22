package com.example.Optimizer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {




    @Override
    protected void configure(AuthenticationManagerBuilder authManager) throws Exception {
        // This is the code you usually have to configure your authentication manager.
        // This configuration will be used by authenticationManagerBean() below.
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // ALTHOUGH THIS SEEMS LIKE USELESS CODE,
        // IT'S REQUIRED TO PREVENT SPRING BOOT AUTO-CONFIGURATION
        return super.authenticationManagerBean();
    }

    @Bean
    public JwtFilter jwtAuthenticationFilter() {
        return new JwtFilter();
    }

    @Override
    protected void configure(HttpSecurity http)
            throws Exception {
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


                .antMatchers("/optimizer/**").permitAll()


                .anyRequest().authenticated();
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    }
}