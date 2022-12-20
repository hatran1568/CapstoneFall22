package com.tripplanner.AuthorizationService.security;

import com.tripplanner.AuthorizationService.dto.OAuth2UserDTO;
import com.tripplanner.AuthorizationService.dto.UserDTO;
import com.tripplanner.AuthorizationService.entity.User;
import com.tripplanner.AuthorizationService.entity.reppository.UserRepository;

import com.tripplanner.AuthorizationService.service.implementers.UserDTOServiceImplementer;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.*;

@Component
@Slf4j
public class JwtTokenProvider {
    @Autowired
    UserDTOServiceImplementer userDTOService;

    @Autowired
    UserRepository userRepository;
    // Đoạn JWT_SECRET này là bí mật, chỉ có phía server biết
    private final String JWT_SECRET = "toikhongbietvietginencogiminhbanlaisaunhe";

    //Thời gian có hiệu lực của chuỗi jwt
    private final long JWT_EXPIRATION = 604800000L;

    private final long RESET_PASSWORD_EXPIRATION = 600000L;

    // Tạo ra jwt từ thông tin user
    public String generateToken(UserDTO userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
        // Tạo chuỗi json web token từ id của user.
        return Jwts.builder()
                .setSubject(Long.toString(userDetails.getUser().getUserID())).claim("role", userDetails.getRole().getRoleName().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    public String generateToken(OAuth2UserDTO userDetails) {
        Date now = new Date();
        User user = userRepository.findByEmail(userDetails.getEmail());

        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
        // Tạo chuỗi json web token từ id của user.
        return Jwts.builder()
                .setSubject(Long.toString(user.getUserID())).claim("role", user.getRole().getRoleName().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    // Lấy thông tin user từ jwt
    public int getUserIdFromJWT(String token) {
        System.out.println(token);
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        return Integer.parseInt(claims.getSubject());
    }

    public String getRoleFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        return (String) claims.get("role");
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }
        return false;
    }

    public String generatePasswordResetToken(int userID) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + RESET_PASSWORD_EXPIRATION);

        String resetPasswordToken = Jwts.builder()
                .setSubject("Reset password")
                .claim("UUID", UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();

        return resetPasswordToken;
    }

    public boolean checkValid(String jwt) {
        if (StringUtils.hasText(jwt) && validateToken(jwt)) {
            int userId = getUserIdFromJWT(jwt);

            UserDTO userDetails = userDTOService.loadUserById(userId);
            if (userDetails != null) {
                return true;
            }
        }
        return false;
    }

    public String getAuthen(String jwt){
        if (StringUtils.hasText(jwt) && validateToken(jwt)) {
            int userId = getUserIdFromJWT(jwt);

            UserDTO userDetails = userDTOService.loadUserById(userId);
            if(userDetails != null) {
                UsernamePasswordAuthenticationToken
                        authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails
                                .getAuthorities());

                return  userDetails.getRole().getRoleName();

            }
        }
        return  null;
    }

}
