package com.example.UserService.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
public class JwtFilter extends GenericFilterBean {
    @Autowired
    RestTemplateClient restTemplateClient;
    @Autowired
    private DiscoveryClient discoveryClient;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        final HttpServletRequest request = (HttpServletRequest) servletRequest;
        final HttpServletResponse response = (HttpServletResponse) servletResponse;
        try {

            String token = getJwtFromRequest(request);
            List<ServiceInstance> instances = discoveryClient.getInstances("authorization-service");

            ServiceInstance instance = instances.get(0);
            Boolean isValid = restTemplateClient.restTemplate().getForObject(instance.getUri() + "/auth/api/checkValid/" + token, Boolean.class);
            if (isValid) {
                String result = restTemplateClient.restTemplate().getForObject(instance.getUri() + "/auth/api/getAuthentication/" + token, String.class);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(null, null, Collections.singleton(new SimpleGrantedAuthority(result)));


                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));


                SecurityContextHolder.getContext().setAuthentication(authentication);


            }

    } catch (Exception ex) {
        log.error("failed on set user authentication", ex);
    }
        filterChain.doFilter(request, response);
//        throw new ServletException("An exception occurred");
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // Kiểm tra xem header Authorization có chứa thông tin jwt không
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}