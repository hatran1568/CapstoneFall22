package com.tripplanner.UserService.config;

import com.tripplanner.UserService.repository.UserRepository;
import io.jsonwebtoken.*;
import java.util.Date;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtTokenProvider {

  // Đoạn JWT_SECRET này là bí mật, chỉ có phía server biết
  private final String JWT_SECRET = "toikhongbietvietginencogiminhbanlaisaunhe";
  //Thời gian có hiệu lực của chuỗi jwt
  private final long JWT_EXPIRATION = 604800000L;
  private final long RESET_PASSWORD_EXPIRATION = 600000L;

  @Autowired
  UserRepository userRepository;

  // Tạo ra jwt từ thông tin user
  //    public String generateToken(UserDTO userDetails) {
  //        Date now = new Date();
  //        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
  //        // Tạo chuỗi json web token từ id của user.
  //        return Jwts.builder()
  //                .setSubject(Long.toString(userDetails.getUser().getUserID())).claim("role", userDetails.getRole().getRoleName().toString())
  //                .setIssuedAt(now)
  //                .setExpiration(expiryDate)
  //                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
  //                .compact();
  //    }

  // Lấy thông tin user từ jwt
  public int getUserIdFromJWT(String token) {
    System.out.println(token);
    Claims claims = Jwts
      .parser()
      .setSigningKey(JWT_SECRET)
      .parseClaimsJws(token)
      .getBody();

    return Integer.parseInt(claims.getSubject());
  }

  public String getRoleFromJWT(String token) {
    Claims claims = Jwts
      .parser()
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

    return Jwts
      .builder()
      .setSubject("Reset password")
      .claim("UUID", UUID.randomUUID().toString())
      .setIssuedAt(now)
      .setExpiration(expiryDate)
      .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
      .compact();
  }
}
